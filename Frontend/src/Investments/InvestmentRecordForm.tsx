import React, { useState, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react'; // Import Auth0 hook
import { useSnackbar } from 'notistack'; // Import useSnackbar hook
import './Investments.css'; // Import the updated CSS styles

const InvestmentForm: React.FC = () => {
  const [description, setDescription] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [firm, setFirm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false); // Added loading state
  const { user } = useAuth0(); // Get user information from Auth0
  const { enqueueSnackbar } = useSnackbar(); // Hook for notifications
  const formRef = useRef<HTMLFormElement>(null); // Create a ref for the form element

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/[^0-9.]/g, ''); // Remove non-digit characters except for the decimal point
    const parts = value.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    setAmount(parts.join('.'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.sub) {
      enqueueSnackbar('User not authenticated!', { variant: 'error' });
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      enqueueSnackbar('End date must be after start date.', { variant: 'error' });
      return;
    }

    const investmentData = {
      userId: user.sub, // Use Auth0 user ID
      description,
      startDate,
      endDate,
      amount: Number(amount.replace(/,/g, '')), // Convert amount to number
      firm,
    };

    setLoading(true);
    try {
      const response = await fetch('https://moneymap-1.onrender.com/investments', { // Updated URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(investmentData),
      });

      if (response.ok) {
        enqueueSnackbar('Investment added successfully!', { variant: 'success' });
        // Clear the form
        if (formRef.current) {
          formRef.current.reset(); // Reset form fields
        }
        setDescription('');
        setStartDate('');
        setEndDate('');
        setAmount('');
        setFirm('');
      } else {
        const errorResponse = await response.json();
        enqueueSnackbar(`Failed to add investment: ${errorResponse.message}`, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Error: ' + (error instanceof Error ? error.message : 'Unknown error'), { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='d-box'>
    <div className="form-page-container">
      <form onSubmit={handleSubmit} className="form-container" ref={formRef}>
        <div className="form-field">
          <label htmlFor="description" className="label">Description:</label>
          <input
            type="text"
            id="description"
            className="input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            />
        </div>

        <div className="form-field">
          <label htmlFor="startDate" className="label">Starting Date:</label>
          <input
            type="date"
            id="startDate"
            className="input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            />
        </div>

        <div className="form-field">
          <label htmlFor="endDate" className="label">Ending Date:</label>
          <input
            type="date"
            id="endDate"
            className="input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            />
        </div>

        <div className="form-field">
          <label htmlFor="amount" className="label">Amount:</label>
          <input
            type="text"
            id="amount"
            className="input"
            value={amount}
            onChange={handleAmountChange}
            required
            />
        </div>

        <div className="form-field">
          <label htmlFor="firm" className="label">Firm:</label>
          <input
            type="text"
            id="firm"
            className="input"
            value={firm}
            onChange={(e) => setFirm(e.target.value)}
            required
            />
        </div>

        <button type="submit" className="button" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
            
            
            
            </div>
  );
};

export default InvestmentForm;
