import React, { useEffect, useState } from 'react';
import { fetchRecordsByUserAndMonth } from '../api.tsx';

interface FinancialRecordsProps {
  userId: string;
  month: string;
  year: string;
}

const FinancialRecords: React.FC<FinancialRecordsProps> = ({ userId, month, year }) => {
  const [records, setRecords] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getRecords = async () => {
      setLoading(true);
      try {
        const fetchedRecords = await fetchRecordsByUserAndMonth(userId, month, year);
        console.log('Fetched Records:', fetchedRecords);
        setRecords(fetchedRecords);
        setError(null);
      } catch (error) {
        setError('Failed to fetch records.');
        console.error('Error fetching records:', error);
        setRecords([]); // Clear records if fetching fails
      } finally {
        setLoading(false);
      }
    };

    getRecords();
  }, [userId, month, year]);

  return (
    <div>
      <h1>Financial Records</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {records.length === 0 && !loading && !error && <p>No records found.</p>}
      {records.length > 0 && (
        <ul>
          {records.map((record) => (
            <li key={record._id}>
              {record.description} - {record.amount} - {new Date(record.date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FinancialRecords;
