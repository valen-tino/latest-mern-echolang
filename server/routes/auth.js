import express from 'express';
import jwt from 'jsonwebtoken';
import { UserCollection } from '../models/user.js';
import { hashPassword, verifyPassword, validatePassword } from '../../lib/utils/password.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = req.app.locals.db;

    const user = await db.collection(UserCollection).findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: {
          code: 'AUTH_INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: {
          code: 'AUTH_INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'Internal server error'
      }
    });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const db = req.app.locals.db;

    // Validate password
    const validation = validatePassword(password);
    if (!validation.isValid) {
      return res.status(400).json({
        error: {
          code: 'AUTH_INVALID_PASSWORD',
          message: 'Password does not meet requirements',
          details: validation.errors
        }
      });
    }

    // Check if user already exists
    const existingUser = await db.collection(UserCollection).findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: {
          code: 'AUTH_EMAIL_EXISTS',
          message: 'Email already registered'
        }
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    const user = {
      email,
      password: hashedPassword,
      name,
      role: 'customer',
      emailVerified: false,
      createdAt: new Date()
    };

    const result = await db.collection(UserCollection).insertOne(user);
    
    const token = jwt.sign(
      { id: result.insertedId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: result.insertedId,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'Internal server error'
      }
    });
  }
});

export default router;