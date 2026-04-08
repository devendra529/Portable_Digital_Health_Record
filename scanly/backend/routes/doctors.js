const express = require('express');
const { readJSON } = require('../middleware/fileStore');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, (req, res) => {
  const users = readJSON('users.json');
  const doctors = users.filter(u => u.role === 'doctor').map(({ password: _, ...d }) => d);
  res.json({ doctors });
});

router.get('/:doctorId', authenticate, (req, res) => {
  const users = readJSON('users.json');
  const doctor = users.find(u => u.id === req.params.doctorId && u.role === 'doctor');
  if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
  const { password: _, ...safeDoctor } = doctor;
  res.json({ doctor: safeDoctor });
});

module.exports = router;
