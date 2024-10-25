import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import  FinancialRecordForm  from './FinancialRecordForm';
import FinancialRecordList  from './FinancialRecordList';
import { useFinancialRecords } from '../context/financial-record-context';
import CategorySpendingChart from './CategorySpendingChart'; // Pie Chart
import LineSpendingChart from './LineSpendingChart'; // Line Chart
import PaymentMethodChart from './PaymentMethodChart'; // Payment Method Line Chart
import { fetchRecordsByUserAndMonth } from '../api'; // Import the API function
import './index.css';

export const Dashboard = () => {
  const { isAuthenticated, user } = useAuth0();
  const { records, setRecords } = useFinancialRecords(); // Retrieve and set records from context
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1); // Default to current month
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear()); // Default to current year

  useEffect(() => {
    if (isAuthenticated && user?.sub) {
      fetchRecords();
    }
  }, [selectedMonth, selectedYear, isAuthenticated, user?.sub]);

  const fetchRecords = async () => {
    try {
      if (user?.sub) {
        const fetchedRecords = await fetchRecordsByUserAndMonth(
          user.sub,
          selectedMonth.toString(), // Ensure this is a string
          selectedYear.toString()    // Ensure this is a string
        );
        console.log('Fetched Records:', fetchedRecords); // Log the fetched records
        setRecords(fetchedRecords); // Update state with fetched records
      }
    } catch (error) {
      console.error('Failed to fetch records:', error);
      // Optionally set error state here
    }
  };

  return (
    <div className="dashboard-container">
      {isAuthenticated ? (
        <>
          <div className="welcome-message">
            <h1 className="name">Welcome, {user?.given_name}!</h1>
          </div>
          <div className="content-wrapper">
            <div className="form-section">
              <h1 id="spend">Add your Spendings</h1>
              <FinancialRecordForm />
            </div>
            
            <FinancialRecordList />
            <div className="charts-section">
              <div className="chart-container">
                <h2>Spending Breakdown (Category)</h2>
                <CategorySpendingChart records={records} />
              </div>
              <div className="chart-container-over">
                <h2>Spending Over Time</h2>
                <LineSpendingChart records={records} />
              </div>
              <div className="chart-container">
                <h2>Spending by Payment Method</h2>
                <PaymentMethodChart records={records} />
              </div>
            </div>
            <div className="filters">

              <label className='Select-Me' style={{ display: 'block', marginBottom: '15px', fontSize: '16px', color: '#fff' }}>
                Month:
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    marginTop: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    backgroundColor: '#1E1E1E', // Background color added
                    color: '#fff', // Ensure text is readable on dark background
                  }}
                />
              </label>
              <label className='Select-Me' style={{ display: 'block', marginBottom: '15px', fontSize: '16px', color: '#fff' }}>
                Year:
                <input
                  type="number"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    marginTop: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    backgroundColor: '#1E1E1E', // Background color added
                    color: '#fff', // Ensure text is readable on dark background
                  }}
                />
              </label>



            </div>
            {/* Conditionally Render the Records Section */}
            {/* { records.length > 0 ? (
              <div className="records-section">
                <table className='tg'>
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Category</th>
                      <th>Payment Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record) => (
                      <tr key={record._id}>
                        <td>{record.description}</td>
                        <td>{record.amount}</td>
                        <td>{new Date(record.date).toLocaleDateString()}</td>
                        <td>{record.category}</td>
                        <td>{record.paymentMethod}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-records-section">
                <p>No records available for the selected month and year.</p>
              </div>
            )} */}
          </div>
        </>
      ) : (
        <div className="auth-prompt">
          <h2>Dashboard</h2>
          <p>Please log in to view your financial records.</p>
        </div>
      )}
    </div>
  );
};
