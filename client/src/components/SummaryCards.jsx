import { formatCurrency } from '../utils/constants';
import { HiOutlineTrendingUp, HiOutlineTrendingDown, HiOutlineCash } from 'react-icons/hi';

const SummaryCards = ({ summary }) => {
  const cards = [
    {
      type: 'income',
      label: 'Total Income',
      value: summary.totalIncome,
      icon: <HiOutlineTrendingUp />,
      prefix: '+',
    },
    {
      type: 'expense',
      label: 'Total Expenses',
      value: summary.totalExpenses,
      icon: <HiOutlineTrendingDown />,
      prefix: '-',
    },
    {
      type: 'balance',
      label: 'Net Balance',
      value: summary.balance,
      icon: <HiOutlineCash />,
      prefix: summary.balance >= 0 ? '+' : '',
    },
  ];

  return (
    <div className="summary-cards">
      {cards.map((card, index) => (
        <div
          key={card.type}
          className={`summary-card ${card.type} fade-in`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="card-icon">{card.icon}</div>
          <div className="card-label">{card.label}</div>
          <div className="card-value">
            {card.prefix}{formatCurrency(Math.abs(card.value))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
