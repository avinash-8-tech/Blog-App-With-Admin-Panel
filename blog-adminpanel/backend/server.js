import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import postRoutes from './src/routes/postRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database route - ADD THIS
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ 
      success: true, 
      time: result.rows[0].now,
      message: 'Database connected!'
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Admin Panel API is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});