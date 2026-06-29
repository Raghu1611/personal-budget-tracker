import { getCategoryInfo, formatCurrency, formatDate } from '../utils/constants';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';

const TransactionList = ({ transactions, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="transactions-card">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="transactions-card">
        <div className="empty-state">
          <div className="empty-icon"></div>
          <h4>No transactions yet</h4>
          <p>Start by adding your first income or expense entry.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transactions-card">
      <div className="transactions-header">
        <h3> Recent Transactions</h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {transactions.length} {transactions.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>
      <ul className="transaction-list">
        {transactions.map((transaction, index) => {
          const category = getCategoryInfo(transaction.category);
          return (
            <li
              key={transaction._id}
              className={`transaction-item ${transaction.type} fade-in`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="transaction-info">
                <div className="transaction-icon">
                  {category.icon}
                </div>
                <div className="transaction-details">
                  <h4>{category.label}</h4>
                  <p>{transaction.description || 'No description'}</p>
                </div>
              </div>
              <div className="transaction-meta">
                <span className="transaction-amount">
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </span>
                <span className="transaction-date">
                  {formatDate(transaction.date)}
                </span>
                <div className="transaction-actions">
                  <button
                    className="btn-icon"
                    onClick={() => onEdit(transaction)}
                    title="Edit transaction"
                    id={`edit-${transaction._id}`}
                  >
                    <HiOutlinePencil />
                  </button>
                  <button
                    className="btn-icon delete"
                    onClick={() => onDelete(transaction._id)}
                    title="Delete transaction"
                    id={`delete-${transaction._id}`}
                  >
                    <HiOutlineTrash />
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TransactionList;
