import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react'; // Import Auth0 hook

// Define the Investment interface
interface Investment {
  _id: string; // Ensure the ID field matches your backend
  userId: string;
  description: string;
  startDate: string;
  endDate: string;
  amount: number;
  firm: string;
}

// Define the context type for investments
interface InvestmentsContextType {
  investments: Investment[];
  fetchInvestments: () => Promise<void>;
  addInvestment: (investment: Omit<Investment, 'userId' | '_id'>) => Promise<void>; // Omit _id for creation
  deleteInvestment: (_id: string) => Promise<void>; // Updated to use _id
}

// Create the InvestmentsContext
const InvestmentsContext = createContext<InvestmentsContextType | undefined>(undefined);

// Create the InvestmentsProvider component
export const InvestmentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const { user, isAuthenticated } = useAuth0(); // Get user info from Auth0

  // Fetch investments based on Auth0 user
  const fetchInvestments = useCallback(async () => {
    if (!isAuthenticated || !user) {
      console.warn('User is not authenticated or user data is missing.');
      return;
    }

    try {
      const response = await axios.get(`https://moneymap-1.onrender.com/investments/getAllByUserID/${user.sub}`);
      setInvestments(response.data); // Set investments with fetched data
    } catch (error) {
      console.error('Error fetching investments:', error);
      // Handle the error gracefully, e.g., show a notification to the user
    }
  }, [isAuthenticated, user]);

  // Add a new investment with user ID from Auth0
  const addInvestment = async (investment: Omit<Investment, 'userId' | '_id'>) => {
    if (!isAuthenticated || !user) return;

    try {
      console.log('Adding investment for user:', user.sub);
      const response = await axios.post(
        'https://moneymap-1.onrender.com/investments',
        { ...investment, userId: user.sub }, // Include user ID in the payload
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) { // Status 201 indicates successful creation
        console.log('Investment added successfully');
        await fetchInvestments(); // Re-fetch the investments after adding
      } else {
        console.error('Failed to add investment:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding investment:', error);
    }
  };

  // Delete an investment based on its ID
  const deleteInvestment = async (_id: string) => {
    if (!_id) {
      console.error("Investment ID is missing.");
      return;
    }

    try {
      console.log(`Deleting investment with ID: ${_id}`);
      // Ensure the URL correctly includes the investment ID
      const response = await axios.delete(`https://moneymap-1.onrender.com/investments/${_id}`);
      console.log("Delete response:", response.data);
      // Optionally re-fetch investments or update state
      await fetchInvestments();
    } catch (error) {
      console.log(_id);
      
      console.error("Error deleting investment:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchInvestments(); // Fetch investments when user info changes or component mounts
    }
  }, [isAuthenticated, user, fetchInvestments]);

  return (
    <InvestmentsContext.Provider value={{ investments, fetchInvestments, addInvestment, deleteInvestment }}>
      {children}
    </InvestmentsContext.Provider>
  );
};

// Custom hook to use the InvestmentsContext
export const useInvestments = () => {
  const context = useContext(InvestmentsContext);
  if (!context) {
    throw new Error('useInvestments must be used within an InvestmentsProvider');
  }
  return context;
};
