import { useState, useEffect, useCallback } from 'react';
import SummaryCards from '../components/SummaryCards';
import MonthPicker from '../components/MonthPicker';
import TransactionList from '../components/TransactionList';
import { IncomeExpenseChart, CategoryPieChart } from '../components/Charts';
import { getTransactions, getSummary } from '../services/api';

const Dashboard = ({ refreshTrigger }) => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    categoryBreakdown: {},
    transactionCount: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [summaryData, transactionsData] = await Promise.all([
        getSummary(month, year),
        getTransactions({ month, year }),
      ]);
      setSummary(summaryData);
      setRecentTransactions(transactionsData.slice(0, 5)); // Show latest 5
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData, refreshTrigger]);

  const handleMonthChange = (newMonth, newYear) => {
    setMonth(newMonth);
    setYear(newYear);
  };

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Overview of your financial activity</p>
      </div>

      <MonthPicker month={month} year={year} onChange={handleMonthChange} />

      <SummaryCards summary={summary} />

      <div className="charts-grid">
        <IncomeExpenseChart
          income={summary.totalIncome}
          expenses={summary.totalExpenses}
        />
        <CategoryPieChart
          categoryBreakdown={summary.categoryBreakdown}
        />
      </div>

      <TransactionList
        transactions={recentTransactions}
        onEdit={() => {}}
        onDelete={() => {}}
        loading={loading}
      />
    </div>
  );
};

export default Dashboard;
