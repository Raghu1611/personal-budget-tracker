import { useNavigate } from 'react-router-dom';
import TransactionForm from '../components/TransactionForm';
import { createTransaction } from '../services/api';

const AddTransaction = ({ onToast, onDataChange }) => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await createTransaction(formData);
      onToast('Transaction added successfully!', 'success');
      onDataChange();
      navigate('/transactions');
    } catch (error) {
      console.error('Error adding transaction:', error);
      onToast('Failed to add transaction', 'error');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Add Transaction</h2>
        <p>Record a new income or expense entry</p>
      </div>

      <TransactionForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddTransaction;
