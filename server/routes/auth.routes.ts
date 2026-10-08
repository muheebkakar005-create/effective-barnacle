import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { readDb, writeDb, User } from '../data/db.ts';
import { generateToken, authenticate, AuthenticatedRequest } from '../middleware/auth.ts';

const router = Router();

// Register customer
router.post('/register', (req, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
      return;
    }

    const db = readDb();
    const existing = db.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      phone: (phone || '').trim(),
      role: 'customer',
      addresses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.users.push(newUser);
    writeDb(db);

    const token = generateToken(newUser);
    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        addresses: newUser.addresses
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Server error during registration.' });
  }
});

// Login
router.post('/login', (req, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const db = readDb();
    const user = db.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const token = generateToken(user);
    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses || []
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Server error during login.' });
  }
});

// Current user profile
router.get('/me', authenticate, (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = readDb();
    const user = db.users.find(u => u.id === req.user?.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses || [],
        createdAt: user.createdAt
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch user profile.' });
  }
});

// Update profile / address
router.put('/profile', authenticate, (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = readDb();
    const userIndex = db.users.findIndex(u => u.id === req.user?.id);
    if (userIndex === -1) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const { name, phone, addresses, newPassword } = req.body;
    const user = db.users[userIndex];

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (Array.isArray(addresses)) user.addresses = addresses;
    if (newPassword && newPassword.length >= 6) {
      user.password = bcrypt.hashSync(newPassword, 10);
    }
    user.updatedAt = new Date().toISOString();

    writeDb(db);

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses || []
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to update profile.' });
  }
});

export default router;
