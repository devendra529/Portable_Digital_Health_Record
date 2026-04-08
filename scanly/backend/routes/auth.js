const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { readJSON, writeJSON } = require('../middleware/fileStore');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password, role = 'patient',
      specialization, licenseNumber, bloodGroup, dateOfBirth, gender } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password required' });
    }

    const users = readJSON('users.json');
    const emailLower = email.toLowerCase().trim();

    if (users.find(u => u.email === emailLower)) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = {
      id: uuidv4(),
      name,
      email: emailLower,
      phone,
      password: hashedPassword,
      role,
      verified: true,
      doctorVerified: role === 'doctor' ? false : undefined,
      specialization: role === 'doctor' ? specialization : undefined,
      licenseNumber: role === 'doctor' ? licenseNumber : undefined,
      bloodGroup: role === 'patient' ? bloodGroup : undefined,
      dateOfBirth: role === 'patient' ? dateOfBirth : undefined,
      gender: role === 'patient' ? gender : undefined,
      qrCode: null,
      createdAt: new Date().toISOString(),
      avatar: null
    };

    users.push(newUser);
    writeJSON('users.json', users);

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const users = readJSON('users.json');
    const user = users.find(u => u.email === email.toLowerCase().trim());
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get current user
router.get('/me', authenticate, (req, res) => {
  const { password: _, ...userWithoutPassword } = req.user;
  res.json({ user: userWithoutPassword });
});

// Update profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const users = readJSON('users.json');
    const idx = users.findIndex(u => u.id === req.user.id);
    if (idx === -1) return res.status(404).json({ error: 'User not found' });

    const allowedFields = ['name', 'phone', 'bloodGroup', 'dateOfBirth', 'gender', 'specialization', 'avatar'];
    allowedFields.forEach(f => {
      if (req.body[f] !== undefined) users[idx][f] = req.body[f];
    });

    writeJSON('users.json', users);
    const { password: _, ...userWithoutPassword } = users[idx];
    res.json({ user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
