import React from 'react';
import InvestmentForm from '../Investments/InvestmentRecordForm';
import InvestmentTable from '../Investments/InvestmentTable';
import { InvestmentsProvider } from '../context/expense-record-context';
import './Investments.css';

const Investments: React.FC = () => {
  return (
    <InvestmentsProvider> {/* Wrap everything in the provider */}
      <div className='investment-css'>
        <h1 className="heading">Investments</h1>
        <div className="investment-container">
          <InvestmentForm onInvestmentAdded={function (): void {
          } } /> 
          <InvestmentTable onInvestmentAdded={function (): void {
          
          } } />
        </div>
      </div>
    </InvestmentsProvider>
  );
};

export default Investments;
