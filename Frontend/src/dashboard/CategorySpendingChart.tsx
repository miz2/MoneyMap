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

// Register components
ChartJS.register(LineElement, PointElement, Tooltip, Legend, Filler, CategoryScale, LinearScale);

interface CategorySpendingChartProps {
  records: FinancialRecord[];
}

const CategorySpendingChart: React.FC<CategorySpendingChartProps> = ({ records }) => {
  const categoryData: ChartData<'line', number[], string> = useMemo(() => {
    const dataMap = new Map<string, number>();

    records.forEach((record) => {
      if (dataMap.has(record.category)) {
        dataMap.set(record.category, dataMap.get(record.category)! + record.amount);
      } else {
        dataMap.set(record.category, record.amount);
      }
    });

    const labels = Array.from(dataMap.keys());
    const data = Array.from(dataMap.values());

    const datasets: ChartDataset<'line', number[]>[] = [
      {
        label: 'Spending by Category',
        data,
        fill: true,
        backgroundColor: (context: any) => {
          const { chart } = context;
          const { ctx } = chart;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(75, 192, 192, 0.4)');
          gradient.addColorStop(1, 'rgba(75, 192, 192, 0.1)');
          return gradient;
        },
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 3,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
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
        data={categoryData}
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
              borderColor: 'rgba(75, 192, 192, 0.7)',
              borderWidth: 2,
              callbacks: {
                label: function (context) {
                  // Explicitly cast `context.raw` to number
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

export default CategorySpendingChart;
