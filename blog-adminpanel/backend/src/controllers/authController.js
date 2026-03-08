import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide all fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existingAdmin = await db.query(
      'SELECT * FROM admins WHERE email = $1',
      [email]
    );

    if (existingAdmin.rows.length > 0) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await db.query(
      `INSERT INTO admins (name, email, password) 
       VALUES ($1, $2, $3) 
       RETURNING id, name, email, created_at`,
      [name, email, hashedPassword]
    );

    const admin = result.rows[0];

    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      admin
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const adminResult = await db.query(
      'SELECT * FROM admins WHERE email = $1',
      [email]
    );

    if (adminResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const admin = adminResult.rows[0];

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getMe = async (req, res) => {
  try {
    const adminResult = await db.query(
      'SELECT id, name, email, created_at FROM admins WHERE id = $1',
      [req.user.id]
    );

    if (adminResult.rows.length === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.json({
      success: true,
      admin: adminResult.rows[0]
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};