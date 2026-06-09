import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import MonthPicker from '../components/MonthPicker';
import TypeFilter from '../components/TypeFilter';
import ConfirmModal from '../components/ConfirmModal';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from '../services/api';

const Transactions = ({ onToast, onDataChange }) => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [typeFilter, setTypeFilter] = useState('all');
  const [confirmState, setConfirmState] = useState({ open: false, id: null });

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTransactions({
        month,
        year,
        ...(typeFilter !== 'all' ? { type: typeFilter } : {}),
      });
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      onToast('Failed to load transactions', 'error');
    } finally {
      setLoading(false);
    }
  }, [month, year, typeFilter, onToast]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId) {
      const found = transactions.find((t) => t._id === editId);
      if (found) {
        setEditingTransaction(found);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setSearchParams({});
    }
  }, [searchParams, transactions, setSearchParams]);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    setConfirmState({ open: true, id });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteTransaction(confirmState.id);
      onToast('Transaction deleted', 'success');
      fetchTransactions();
      onDataChange();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      onToast('Failed to delete transaction', 'error');
    } finally {
      setConfirmState({ open: false, id: null });
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

      <TypeFilter value={typeFilter} onChange={setTypeFilter} />

      <TransactionList
        transactions={transactions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <ConfirmModal
        isOpen={confirmState.open}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmState({ open: false, id: null })}
      />
    </div>
  );
};

export default Transactions;
