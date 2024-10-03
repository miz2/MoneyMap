// src/dashboard/Investments.tsx
import React from 'react';
import InvestmentForm from '../Investments/InvestmentRecordForm';
import InvestmentTable from '../Investments/InvestmentTable'; // Import the table component
import { InvestmentsProvider } from '../context/expense-record-context'; // Import the provider
import './Investments.css'; // Import the CSS file for layout

const Investments: React.FC = () => {
  return (
    <InvestmentsProvider> {/* Wrap everything in the provider */}
      <div className='investment-css'>
        <h1 className="heading">Investments</h1>
        <div className="investment-container">
          <InvestmentForm /> {/* The form component */}
          <InvestmentTable /> {/* The table component */}
        </div>
      </div>
    </InvestmentsProvider>
  );
};

export default Investments;
