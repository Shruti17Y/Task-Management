const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Task Management API is running' });
});

app.get('/api', (req, res) => {
  res.json({ message: 'Task Management API is running' });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    message: 'Backend API is connected and running',
    database: 'Ignored (In-Memory)',
    timestamp: new Date(),
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Error handling middleware
const { errorHandler } = require('./middleware/errorMiddleware');
app.use(errorHandler);

// Port configuration
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
