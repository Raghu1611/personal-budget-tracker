const TypeFilter = ({ value, onChange }) => {
  return (
    <div className="type-filter">
      <button
        id="filter-all"
        className={`type-filter-btn${value === 'all' ? ' active' : ''}`}
        onClick={() => onChange('all')}
      >
        All
      </button>
      <button
        id="filter-income"
        className={`type-filter-btn${value === 'income' ? ' active' : ''}`}
        onClick={() => onChange('income')}
      >
        Income
      </button>
      <button
        id="filter-expense"
        className={`type-filter-btn${value === 'expense' ? ' active' : ''}`}
        onClick={() => onChange('expense')}
      >
        Expense
      </button>
    </div>
  );
};

export default TypeFilter;
