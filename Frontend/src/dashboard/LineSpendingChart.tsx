import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FinancialRecord } from "../context/financial-record-context";; // Assuming FinancialRecord is defined somewhere
import { useMemo } from 'react';

interface LineSpendingChartProps {
  records: FinancialRecord[];
}

const LineSpendingChart = ({ records }: LineSpendingChartProps) => {
  // Prepare data for line chart
  const data = useMemo(() => {
    const groupedByDate = records.reduce((acc, record) => {
      const date = new Date(record.date).toLocaleDateString(); // Assuming record has a 'date' field
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += record.amount; // Assuming record has 'amount'
      return acc;
    }, {} as Record<string, number>);

    // Convert grouped data into an array for the chart
    return Object.entries(groupedByDate).map(([date, amount]) => ({ date, amount }));
  }, [records]);

  return (
    <div className="line-chart-container">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineSpendingChart;
