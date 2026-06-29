import { useState, useEffect } from 'react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../utils/constants';

const TransactionForm = ({ onSubmit, editingTransaction, onCancel }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        type: editingTransaction.type,
        amount: editingTransaction.amount.toString(),
        category: editingTransaction.category,
        description: editingTransaction.description || '',
        date: new Date(editingTransaction.date).toISOString().split('T')[0],
      });
    }
  }, [editingTransaction]);

  const categories = formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const validate = () => {
    const newErrors = {};
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
    });

    // Reset form
    if (!editingTransaction) {
      setFormData({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
    setErrors({});
  };

  const handleChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      // Reset category when type changes
      if (field === 'type') {
        updated.category = '';
      }
      return updated;
    });
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="form-card fade-in">
      <h3>
        {editingTransaction ? ' Edit Transaction' : ' Add Transaction'}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Type Toggle */}
          <div className="form-group full-width">
            <label>Type</label>
            <div className="type-toggle">
              <button
                type="button"
                className={`type-btn ${formData.type === 'income' ? 'active-income' : ''}`}
                onClick={() => handleChange('type', 'income')}
                id="type-income-btn"
              >
                ↑ Income
              </button>
              <button
                type="button"
                className={`type-btn ${formData.type === 'expense' ? 'active-expense' : ''}`}
                onClick={() => handleChange('type', 'expense')}
                id="type-expense-btn"
              >
                ↓ Expense
              </button>
            </div>
          </div>

          {/* Amount */}
          <div className="form-group">
            <label htmlFor="amount-input">Amount (₹)</label>
            <input
              id="amount-input"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              style={errors.amount ? { borderColor: 'var(--expense-color)' } : {}}
            />
            {errors.amount && <span style={{ color: 'var(--expense-color)', fontSize: '0.75rem' }}>{errors.amount}</span>}
          </div>

          {/* Date */}
          <div className="form-group">
            <label htmlFor="date-input">Date</label>
            <input
              id="date-input"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              style={errors.date ? { borderColor: 'var(--expense-color)' } : {}}
            />
            {errors.date && <span style={{ color: 'var(--expense-color)', fontSize: '0.75rem' }}>{errors.date}</span>}
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category-select">Category</label>
            <select
              id="category-select"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              style={errors.category ? { borderColor: 'var(--expense-color)' } : {}}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
            {errors.category && <span style={{ color: 'var(--expense-color)', fontSize: '0.75rem' }}>{errors.category}</span>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description-input">Description (optional)</label>
            <input
              id="description-input"
              type="text"
              placeholder="e.g., Lunch with team"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="form-group full-width">
            <div className="form-actions">
              <button type="submit" className="btn-primary" id="submit-transaction-btn">
                {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
              </button>
              {editingTransaction && (
                <button type="button" className="btn-secondary" onClick={onCancel} id="cancel-edit-btn">
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
