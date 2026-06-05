import { useState, useEffect, useCallback } from 'react';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import MonthPicker from '../components/MonthPicker';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from '../services/api';

const Transactions = ({ onToast, onDataChange }) => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTransactions({ month, year });
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      onToast('Failed to load transactions', 'error');
    } finally {
      setLoading(false);
    }
  }, [month, year, onToast]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleSubmit = async (formData) => {
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction._id, formData);
        onToast('Transaction updated successfully!', 'success');
        setEditingTransaction(null);
      } else {
        await createTransaction(formData);
        onToast('Transaction added successfully!', 'success');
      }
      fetchTransactions();
      onDataChange();
    } catch (error) {
      console.error('Error saving transaction:', error);
      onToast('Failed to save transaction', 'error');
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await deleteTransaction(id);
      onToast('Transaction deleted', 'success');
      fetchTransactions();
      onDataChange();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      onToast('Failed to delete transaction', 'error');
    }
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  const handleMonthChange = (newMonth, newYear) => {
    setMonth(newMonth);
    setYear(newYear);
  };

  return (
    <div>
      <div className="page-header">
        <h2>Transactions</h2>
        <p>Manage your income and expense entries</p>
      </div>

      <TransactionForm
        onSubmit={handleSubmit}
        editingTransaction={editingTransaction}
        onCancel={handleCancelEdit}
      />

      <MonthPicker month={month} year={year} onChange={handleMonthChange} />

      <TransactionList
        transactions={transactions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  );
};

export default Transactions;
