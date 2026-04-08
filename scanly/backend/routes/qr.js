const express = require('express');
const QRCode = require('qrcode');
const { readJSON, writeJSON } = require('../middleware/fileStore');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Generate QR for patient
router.post('/generate', authenticate, async (req, res) => {
  try {
    const patientId = req.user.role === 'patient' ? req.user.id : req.body.patientId;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const qrUrl = `${frontendUrl}/patient/view/${patientId}`;
    const qrDataUrl = await QRCode.toDataURL(qrUrl, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 2,
      color: { dark: '#0f172a', light: '#ffffff' }
    });

    const users = readJSON('users.json');
    const idx = users.findIndex(u => u.id === patientId);
    if (idx !== -1) {
      users[idx].qrCode = qrDataUrl;
      users[idx].qrUrl = qrUrl;
      writeJSON('users.json', users);
    }

    res.json({ qrCode: qrDataUrl, qrUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public - get patient data via QR scan (limited info)
router.get('/scan/:patientId', (req, res) => {
  const users = readJSON('users.json');
  const patient = users.find(u => u.id === req.params.patientId && u.role === 'patient');
  if (!patient) return res.status(404).json({ error: 'Patient not found' });

  const records = readJSON('records.json');
  const patientRecords = records.filter(r => r.patientId === patient.id);

  const { password: _, ...safePatient } = patient;
  res.json({ patient: safePatient, records: patientRecords, scanTime: new Date().toISOString() });
});

module.exports = router;
