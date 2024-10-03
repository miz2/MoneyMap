import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth0 } from "@auth0/auth0-react"; // Import Auth0 hook

export interface FinancialRecord {
  _id?: string;
  userId: string;
  date: string; // Ensure this matches your date format
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
}

interface FinancialRecordsContextType {
  records: FinancialRecord[];
  setRecords: React.Dispatch<React.SetStateAction<FinancialRecord[]>>; // Add setRecords
  addRecord: (record: FinancialRecord) => Promise<void>;
  updateRecord: (id: string, newRecord: FinancialRecord) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
}

export const FinancialRecordsContext = createContext<FinancialRecordsContextType | undefined>(undefined);

interface FinancialRecordsProviderProps {
  children: ReactNode;
}

export const FinancialRecordsProvider: React.FC<FinancialRecordsProviderProps> = ({ children }) => {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const { user, isAuthenticated } = useAuth0(); // Use Auth0 hook to get user information

  const fetchRecords = async () => {
    if (!isAuthenticated || !user || !user.sub) return; // Ensure user and user.sub (user ID) are available
    try {
      const response = await fetch(`https://moneymap-1.onrender.com/financial-records/getAllByUserID/${user.sub}`);
      
      if (response.ok) {
        const records = await response.json();
        setRecords(records);
      } else {
        console.error("Failed to fetch records:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  useEffect(() => {
    fetchRecords(); // Fetch records only if the user is authenticated and user.sub is available
  }, [isAuthenticated, user?.sub]); // Depend on isAuthenticated and user.sub

  const addRecord = async (record: FinancialRecord) => {
    try {
      const response = await fetch("https://moneymap-1.onrender.com/financial-records", {
        method: "POST",
        body: JSON.stringify(record),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const newRecord = await response.json();
        setRecords((prev) => [...prev, newRecord]);
      } else {
        console.error("Failed to add record:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding record:", error);
    }
  };

  const updateRecord = async (id: string, newRecord: FinancialRecord) => {
    try {
      const response = await fetch(`https://moneymap-1.onrender.com/financial-records/${id}`, {
        method: "PUT",
        body: JSON.stringify(newRecord),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const updatedRecord = await response.json();
        setRecords((prev) => prev.map((record) => (record._id === id ? updatedRecord : record)));
      } else {
        console.error("Failed to update record:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      const response = await fetch(`https://moneymap-1.onrender.com/financial-records/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setRecords((prev) => prev.filter((record) => record._id !== id));
      } else {
        console.error("Failed to delete record:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  return (
    <FinancialRecordsContext.Provider value={{ records, setRecords, addRecord, updateRecord, deleteRecord }}>
      {children}
    </FinancialRecordsContext.Provider>
  );
};

export const useFinancialRecords = () => {
  const context = useContext(FinancialRecordsContext);

  if (!context) {
    throw new Error("useFinancialRecords must be used within a FinancialRecordsProvider");
  }

  return context;
};
