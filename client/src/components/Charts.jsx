import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { getCategoryInfo, CHART_COLORS } from '../utils/constants';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Bar Chart: Income vs Expenses for current month
export const IncomeExpenseChart = ({ income, expenses }) => {
  const data = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        label: 'Amount (₹)',
        data: [income, expenses],
        backgroundColor: [
          'rgba(0, 230, 118, 0.7)',
          'rgba(255, 82, 82, 0.7)',
        ],
        borderColor: [
          'rgba(0, 230, 118, 1)',
          'rgba(255, 82, 82, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
        barPercentage: 0.5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1a1a2e',
        titleColor: '#e8e8f0',
        bodyColor: '#a0a0b8',
        borderColor: 'rgba(108, 99, 255, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: (context) => `₹${context.parsed.y.toLocaleString('en-IN')}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#a0a0b8',
          font: { family: 'Inter', size: 12 },
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.04)',
        },
        ticks: {
          color: '#6b6b82',
          font: { family: 'Inter', size: 11 },
          callback: (value) => `₹${value.toLocaleString('en-IN')}`,
        },
      },
    },
  };

  return (
    <div className="chart-card fade-in">
      <h3>📊 Income vs Expenses</h3>
      <div className="chart-container">
        {income === 0 && expenses === 0 ? (
          <div className="empty-state" style={{ padding: '40px 0' }}>
            <p>No data for this month</p>
          </div>
        ) : (
          <Bar data={data} options={options} />
        )}
      </div>
    </div>
  );
};

// Pie Chart: Category breakdown for expenses
export const CategoryPieChart = ({ categoryBreakdown }) => {
  const categories = Object.keys(categoryBreakdown || {});
  const values = Object.values(categoryBreakdown || {});

  if (categories.length === 0) {
    return (
      <div className="chart-card fade-in" style={{ animationDelay: '100ms' }}>
        <h3>🍩 Expense by Category</h3>
        <div className="chart-container">
          <div className="empty-state" style={{ padding: '40px 0' }}>
            <p>No expense data to display</p>
          </div>
        </div>
      </div>
    );
  }

  const labels = categories.map(cat => {
    const info = getCategoryInfo(cat);
    return `${info.icon} ${info.label}`;
  });

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: CHART_COLORS.slice(0, categories.length).map(c => c + 'cc'),
        borderColor: CHART_COLORS.slice(0, categories.length),
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#a0a0b8',
          font: { family: 'Inter', size: 11 },
          padding: 12,
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: '#1a1a2e',
        titleColor: '#e8e8f0',
        bodyColor: '#a0a0b8',
        borderColor: 'rgba(108, 99, 255, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: (context) => {
            const total = values.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `₹${context.parsed.toLocaleString('en-IN')} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="chart-card fade-in" style={{ animationDelay: '100ms' }}>
      <h3>🍩 Expense by Category</h3>
      <div className="chart-container">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};
