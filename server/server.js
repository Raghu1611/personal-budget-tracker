const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const { sequelize } = require('./models/Transaction');
const transactionRoutes = require('./routes/transactions');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// SQLite Connection
sequelize.sync()
  .then(() => console.log('✅ SQLite connected and synced successfully'))
  .catch((err) => console.error('❌ SQLite connection error:', err));

// Routes
app.use('/api/transactions', transactionRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Budget Tracker API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
