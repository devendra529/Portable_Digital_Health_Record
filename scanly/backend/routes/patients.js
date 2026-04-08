const express = require('express');
const { readJSON } = require('../middleware/fileStore');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Get patient profile (public via token or doctor access)
router.get('/:patientId', authenticate, (req, res) => {
  const users = readJSON('users.json');
  const patient = users.find(u => u.id === req.params.patientId && u.role === 'patient');
  if (!patient) return res.status(404).json({ error: 'Patient not found' });

  if (req.user.role === 'patient' && req.user.id !== req.params.patientId) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const { password: _, ...safePatient } = patient;
  const records = readJSON('records.json');
  const patientRecords = records.filter(r => r.patientId === patient.id);
  res.json({ patient: safePatient, records: patientRecords });
});

// Search patient by phone (doctor/admin)
router.get('/search/phone', authenticate, authorize('doctor', 'admin'), (req, res) => {
  const { phone } = req.query;
  const users = readJSON('users.json');
  const patient = users.find(u => u.phone === phone && u.role === 'patient');
  if (!patient) return res.status(404).json({ error: 'Patient not found' });
  const { password: _, ...safePatient } = patient;
  const records = readJSON('records.json');
  const patientRecords = records.filter(r => r.patientId === patient.id);
  res.json({ patient: safePatient, records: patientRecords });
});

// Get all patients (admin only)
router.get('/', authenticate, authorize('admin'), (req, res) => {
  const users = readJSON('users.json');
  const patients = users.filter(u => u.role === 'patient').map(({ password: _, ...p }) => p);
  res.json({ patients });
});

module.exports = router;
