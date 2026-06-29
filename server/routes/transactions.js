const express = require('express');
const router = express.Router();
const { Transaction } = require('../models/Transaction');
const { Op } = require('sequelize');

// GET /api/transactions - Get all transactions (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { month, year, type } = req.query;
    let filter = {};

    // Filter by month and year if provided
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      filter.date = { [Op.between]: [startDate, endDate] };
    } else if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59);
      filter.date = { [Op.between]: [startDate, endDate] };
    }

    // Filter by type (income/expense)
    if (type) {
      filter.type = type;
    }

    const transactions = await Transaction.findAll({
      where: filter,
      order: [['date', 'DESC']]
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
});

// GET /api/transactions/summary - Get monthly summary
router.get('/summary', async (req, res) => {
  try {
    const { month, year } = req.query;
    let filter = {};

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      filter.date = { [Op.between]: [startDate, endDate] };
    }

    const transactions = await Transaction.findAll({ where: filter });

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    // Category-wise breakdown for expenses
    const categoryBreakdown = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        if (categoryBreakdown[t.category]) {
          categoryBreakdown[t.category] += t.amount;
        } else {
          categoryBreakdown[t.category] = t.amount;
        }
      });

    res.json({
      totalIncome,
      totalExpenses,
      balance,
      categoryBreakdown,
      transactionCount: transactions.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching summary', error: error.message });
  }
});

// GET /api/transactions/:id - Get single transaction
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transaction', error: error.message });
  }
});

// POST /api/transactions - Create new transaction
router.post('/', async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;

    // Validate required fields
    if (!type || !amount || !category) {
      return res.status(400).json({ message: 'Type, amount, and category are required' });
    }

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ message: 'Type must be either income or expense' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    const transaction = await Transaction.create({
      type,
      amount,
      category,
      description: description || '',
      date: date || new Date()
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: 'Error creating transaction', error: error.message });
  }
});

// PUT /api/transactions/:id - Update transaction
router.put('/:id', async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;

    // Validate type if provided
    if (type && !['income', 'expense'].includes(type)) {
      return res.status(400).json({ message: 'Type must be either income or expense' });
    }

    // Validate amount if provided
    if (amount !== undefined && amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await transaction.update({ type, amount, category, description, date });

    res.json(transaction);
  } catch (error) {
    res.status(400).json({ message: 'Error updating transaction', error: error.message });
  }
});

// DELETE /api/transactions/:id - Delete transaction
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await transaction.destroy();
    res.json({ message: 'Transaction deleted successfully', transaction });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting transaction', error: error.message });
  }
});

module.exports = router;
