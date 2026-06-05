import axios from 'axios';

const API_URL = '/api/transactions';

// Get all transactions with optional filters
export const getTransactions = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.month) params.append('month', filters.month);
  if (filters.year) params.append('year', filters.year);
  if (filters.type) params.append('type', filters.type);

  const response = await axios.get(`${API_URL}?${params.toString()}`);
  return response.data;
};

// Get monthly summary
export const getSummary = async (month, year) => {
  const params = new URLSearchParams();
  if (month) params.append('month', month);
  if (year) params.append('year', year);

  const response = await axios.get(`${API_URL}/summary?${params.toString()}`);
  return response.data;
};

// Create a new transaction
export const createTransaction = async (transactionData) => {
  const response = await axios.post(API_URL, transactionData);
  return response.data;
};

// Update a transaction
export const updateTransaction = async (id, transactionData) => {
  const response = await axios.put(`${API_URL}/${id}`, transactionData);
  return response.data;
};

// Delete a transaction
export const deleteTransaction = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
