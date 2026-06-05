// Category definitions with icons
export const EXPENSE_CATEGORIES = [
  { value: 'food', label: 'Food & Dining', icon: '🍔' },
  { value: 'transport', label: 'Transportation', icon: '🚗' },
  { value: 'housing', label: 'Housing & Rent', icon: '🏠' },
  { value: 'utilities', label: 'Utilities', icon: '💡' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️' },
  { value: 'health', label: 'Healthcare', icon: '🏥' },
  { value: 'education', label: 'Education', icon: '📚' },
  { value: 'personal', label: 'Personal Care', icon: '💈' },
  { value: 'other_expense', label: 'Other', icon: '📦' },
];

export const INCOME_CATEGORIES = [
  { value: 'salary', label: 'Salary', icon: '💰' },
  { value: 'freelance', label: 'Freelance', icon: '💻' },
  { value: 'investment', label: 'Investments', icon: '📈' },
  { value: 'gift', label: 'Gifts', icon: '🎁' },
  { value: 'refund', label: 'Refunds', icon: '🔄' },
  { value: 'other_income', label: 'Other', icon: '💵' },
];

export const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

export const getCategoryInfo = (categoryValue) => {
  return ALL_CATEGORIES.find(c => c.value === categoryValue) || { value: categoryValue, label: categoryValue, icon: '📋' };
};

// Month names
export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format date
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

// Chart color palette
export const CHART_COLORS = [
  '#6c63ff', '#00d2ff', '#ff5252', '#00e676', '#ff9800',
  '#e040fb', '#00bcd4', '#ffeb3b', '#8bc34a', '#ff7043'
];
