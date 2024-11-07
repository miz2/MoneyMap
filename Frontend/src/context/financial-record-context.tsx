import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export interface FinancialRecord {
  _id?: string;
  userId: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
}

interface FinancialRecordsContextType {
  records: FinancialRecord[];
  setRecords: React.Dispatch<React.SetStateAction<FinancialRecord[]>>;
  addRecord: (record: FinancialRecord) => Promise<void>;
  updateRecord: (id: string, newRecord: FinancialRecord) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
}

const FinancialRecordsContext = createContext<FinancialRecordsContextType | undefined>(undefined);

interface FinancialRecordsProviderProps {
  children: ReactNode;
}

// Helper function for error handling
const handleError = (message: string, error: unknown) => {
  console.error(message, error);
};

export const FinancialRecordsProvider: React.FC<FinancialRecordsProviderProps> = ({ children }) => {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const { user, isAuthenticated } = useAuth0();
  const userId = user?.sub;

  // Fetch records when authenticated user is available
  const fetchRecords = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await fetch(`http://localhost:5001/financial-records/getAllByUserID/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setRecords(data);
      } else {
        handleError("Failed to fetch records:", response.statusText);
      }
    } catch (error) {
      handleError("Error fetching records:", error);
    }
  }, [userId]);

  useEffect(() => {
    if (isAuthenticated && userId) fetchRecords();
  }, [isAuthenticated, userId, fetchRecords]);

  const addRecord = useCallback(async (record: FinancialRecord) => {
    try {
      const response = await fetch("http://localhost:5001/financial-records", {
        method: "POST",
        body: JSON.stringify(record),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const newRecord = await response.json();
        setRecords((prev) => [...prev, newRecord]);
      } else {
        handleError("Failed to add record:", response.statusText);
      }
    } catch (error) {
      handleError("Error adding record:", error);
    }
  }, []);

  const updateRecord = useCallback(async (id: string, newRecord: FinancialRecord) => {
    try {
      const response = await fetch(`http://localhost:5001/financial-records/${id}`, {
        method: "PUT",
        body: JSON.stringify(newRecord),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const updatedRecord = await response.json();
        setRecords((prev) => prev.map((record) => (record._id === id ? updatedRecord : record)));
      } else {
        handleError("Failed to update record:", response.statusText);
      }
    } catch (error) {
      handleError("Error updating record:", error);
    }
  }, []);

  const deleteRecord = useCallback(async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5001/financial-records/${id}`, { method: "DELETE" });

      if (response.ok) {
        setRecords((prev) => prev.filter((record) => record._id !== id));
      } else {
        handleError("Failed to delete record:", response.statusText);
      }
    } catch (error) {
      handleError("Error deleting record:", error);
    }
  }, []);

  // Memoize context value to avoid unnecessary re-renders
  const contextValue = useMemo(
    () => ({ records, setRecords, addRecord, updateRecord, deleteRecord }),
    [records, addRecord, updateRecord, deleteRecord]
  );

  return (
    <FinancialRecordsContext.Provider value={contextValue}>
      {children}
    </FinancialRecordsContext.Provider>
  );
};

// Custom hook to use FinancialRecordsContext
export const useFinancialRecords = () => {
  const context = useContext(FinancialRecordsContext);
  if (!context) {
    throw new Error("useFinancialRecords must be used within a FinancialRecordsProvider");
  }
  return context;
};
