import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';


interface Investment {
  _id: string;
  userId: string;
  description: string;
  startDate: string;
  endDate: string;
  amount: number;
  firm: string;
}

// Investments Context Type
interface InvestmentsContextType {
  investments: Investment[];
  fetchInvestments: () => Promise<void>;
  addInvestment: (investment: Omit<Investment, 'userId' | '_id'>) => Promise<void>;
  deleteInvestment: (_id: string) => Promise<void>;
}

// Create InvestmentsContext
const InvestmentsContext = createContext<InvestmentsContextType | undefined>(undefined);

// Helper function to log errors
const handleError = (message: string, error: unknown) => {
  console.error(message, error);
};

export const InvestmentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const { user, isAuthenticated } = useAuth0();

  const userId = user?.sub;

  // Fetch investments for the authenticated user
  const fetchInvestments = useCallback(async () => {
    if (!userId) {
      console.warn('User is not authenticated or user ID is missing.');
      return;
    }

    try {
      const { data } = await axios.get(`https://moneymap-1.onrender.com/investments/getAllByUserID/${userId}`);
      setInvestments(data);
    } catch (error) {
      handleError('Error fetching investments:', error);
    }
  }, [userId]);

  // Add a new investment
  const addInvestment = useCallback(async (investment: Omit<Investment, 'userId' | '_id'>) => {
    if (!userId) return;

    try {
      const response = await axios.post(
        'https://moneymap-1.onrender.com/investments',
        { ...investment, userId },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 201) {
        console.log('Investment added successfully');
        await fetchInvestments();
      } else {
        handleError('Failed to add investment:', response.statusText);
      }
    } catch (error) {
      handleError('Error adding investment:', error);
    }
  }, [userId, fetchInvestments]);

  // Delete an investment
  const deleteInvestment = useCallback(async (_id: string) => {
    if (!_id) {
      console.error('Investment ID is missing.');
      return;
    }

    try {
      const response = await axios.delete(`https://moneymap-1.onrender.com/investments/${_id}`);
      console.log('Delete response:', response.data);
      await fetchInvestments();
    } catch (error) {
      handleError('Error deleting investment:', error);
    }
  }, [fetchInvestments]);

  // Fetch investments when the component mounts or user info changes
  useEffect(() => {
    if (isAuthenticated && userId) fetchInvestments();
  }, [isAuthenticated, userId, fetchInvestments]);

  // Memoize context value to avoid unnecessary re-renders
  const contextValue = useMemo(() => ({
    investments,
    fetchInvestments,
    addInvestment,
    deleteInvestment,
  }), [investments, fetchInvestments, addInvestment, deleteInvestment]);

  return (
    <InvestmentsContext.Provider value={contextValue}>
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
