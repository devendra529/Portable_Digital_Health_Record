const express = require('express');
const { readJSON, writeJSON } = require('../middleware/fileStore');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Get stats
router.get('/stats', authenticate, authorize('admin'), (req, res) => {
  const users = readJSON('users.json');
  const records = readJSON('records.json');
  res.json({
    totalPatients: users.filter(u => u.role === 'patient').length,
    totalDoctors: users.filter(u => u.role === 'doctor').length,
    totalRecords: records.length,
    pendingDoctors: users.filter(u => u.role === 'doctor' && !u.doctorVerified).length,
    totalAdmins: users.filter(u => u.role === 'admin').length
  });
});

// Verify doctor
router.patch('/verify-doctor/:doctorId', authenticate, authorize('admin'), (req, res) => {
  const users = readJSON('users.json');
  const idx = users.findIndex(u => u.id === req.params.doctorId && u.role === 'doctor');
  if (idx === -1) return res.status(404).json({ error: 'Doctor not found' });
  users[idx].doctorVerified = true;
  writeJSON('users.json', users);
  res.json({ message: 'Doctor verified successfully' });
});

// Get all users
router.get('/users', authenticate, authorize('admin'), (req, res) => {
  const users = readJSON('users.json').map(({ password: _, ...u }) => u);
  res.json({ users });
});

// Delete user
router.delete('/users/:userId', authenticate, authorize('admin'), (req, res) => {
  const users = readJSON('users.json');
  const updated = users.filter(u => u.id !== req.params.userId);
  writeJSON('users.json', updated);
  const records = readJSON('records.json');
  const updatedRecords = records.filter(r => r.patientId !== req.params.userId);
  writeJSON('records.json', updatedRecords);
  res.json({ message: 'User deleted' });
});

module.exports = router;
