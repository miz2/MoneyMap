import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
  CategoryScale,
  LinearScale,
  ChartData,
  ChartDataset,
} from 'chart.js';
import { FinancialRecord } from "../context/financial-record-context"; // Adjust the path as necessary

// Register ChartJS components
ChartJS.register(LineElement, PointElement, Tooltip, Legend, Filler, CategoryScale, LinearScale);

interface PaymentMethodChartProps {
  records: FinancialRecord[];
}

const PaymentMethodChart: React.FC<PaymentMethodChartProps> = ({ records }) => {
  const paymentMethodData: ChartData<'line', number[], string> = useMemo(() => {
    const dataMap = new Map<string, number>();

    // Aggregate amounts by payment method
    records.forEach((record) => {
      if (dataMap.has(record.paymentMethod)) {
        dataMap.set(record.paymentMethod, dataMap.get(record.paymentMethod)! + record.amount);
      } else {
        dataMap.set(record.paymentMethod, record.amount);
      }
    });

    // Extract labels (payment methods) and data (aggregated amounts)
    const labels = Array.from(dataMap.keys());
    const data = Array.from(dataMap.values());

    const datasets: ChartDataset<'line', number[]>[] = [
      {
        label: 'Spending by Payment Method',
        data,
        fill: true,
        backgroundColor: (context: any) => {
          const { chart } = context;
          const { ctx } = chart;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(255, 99, 132, 0.4)');
          gradient.addColorStop(1, 'rgba(255, 99, 132, 0.1)');
          return gradient;
        },
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 3,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 99, 132, 1)',
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.3,
        cubicInterpolationMode: 'monotone',
      },
    ];

    return {
      labels,
      datasets,
    };
  }, [records]);

  return (
    <div style={{ width: "90%", height: "500px", margin: "30px auto" }}>
      <Line
        data={paymentMethodData}
        options={{
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            legend: {
              labels: {
                color: '#fff',
                font: {
                  size: 16,
                  family: "'Open Sans', sans-serif"
                }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: '#fff',
              bodyColor: '#fff',
              borderColor: 'rgba(255, 99, 132, 0.7)',
              borderWidth: 2,
              callbacks: {
                label: function (context) {
                  const value = (context.raw as number).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                  return `${context.dataset.label}: ${value}`;
                }
              }
            }
          },
          scales: {
            x: {
              ticks: {
                color: '#fff',
                font: {
                  size: 14,
                  family: "'Open Sans', sans-serif"
                }
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.2)',
              }
            },
            y: {
              ticks: {
                color: '#fff',
                font: {
                  size: 14,
                  family: "'Open Sans', sans-serif"
                }
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.2)',
              }
            }
          },
          animation: {
            duration: 1500,
            easing: 'easeOutBounce'
          }
        }}
      />
    </div>
  );
};

export default PaymentMethodChart;
