import React, { useState, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useSnackbar } from 'notistack';
import './Investments.css';

interface InvestmentFormProps {
  onInvestmentAdded: () => void; 
}

const InvestmentForm: React.FC<InvestmentFormProps> = ({ onInvestmentAdded }) => {
  const [description, setDescription] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [firm, setFirm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth0();
  const { enqueueSnackbar } = useSnackbar();
  const formRef = useRef<HTMLFormElement>(null);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/[^0-9.]/g, '');
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
      userId: user.sub,
      description,
      startDate,
      endDate,
      amount: Number(amount.replace(/,/g, '')),
      firm,
    };

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/investments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(investmentData),
      });

      if (response.ok) {
        enqueueSnackbar('Investment added successfully!', { variant: 'success' });
        onInvestmentAdded(); // Call the function to refetch investments
        if (formRef.current) {
          formRef.current.reset();
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
