const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { readJSON, writeJSON } = require('../middleware/fileStore');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|pdf|dicom/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype) || file.mimetype === 'application/pdf';
    if (ext || mime) cb(null, true);
    else cb(new Error('Only images and PDFs allowed'));
  }
});

// Upload record
router.post('/upload', authenticate, upload.single('file'), async (req, res) => {
  try {
    const { title, description, category, patientId } = req.body;
    if (!req.file) return res.status(400).json({ error: 'File required' });

    const records = readJSON('records.json');
    const targetPatientId = req.user.role === 'patient' ? req.user.id : patientId;

    const record = {
      id: uuidv4(),
      patientId: targetPatientId,
      uploadedBy: req.user.id,
      uploaderRole: req.user.role,
      title: title || req.file.originalname,
      description: description || '',
      category: category || 'General',
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: `/uploads/${req.file.filename}`,
      createdAt: new Date().toISOString(),
      tags: []
    };

    records.push(record);
    writeJSON('records.json', records);
    res.status(201).json({ record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get records for a patient
router.get('/patient/:patientId', authenticate, (req, res) => {
  const { patientId } = req.params;
  if (req.user.role === 'patient' && req.user.id !== patientId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  const records = readJSON('records.json');
  const patientRecords = records.filter(r => r.patientId === patientId);
  res.json({ records: patientRecords });
});

// Get my records (patient)
router.get('/mine', authenticate, authorize('patient'), (req, res) => {
  const records = readJSON('records.json');
  const myRecords = records.filter(r => r.patientId === req.user.id);
  res.json({ records: myRecords });
});

// Delete record
router.delete('/:id', authenticate, (req, res) => {
  const records = readJSON('records.json');
  const record = records.find(r => r.id === req.params.id);
  if (!record) return res.status(404).json({ error: 'Record not found' });
  if (req.user.role === 'patient' && record.patientId !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }
  const updated = records.filter(r => r.id !== req.params.id);
  writeJSON('records.json', updated);
  res.json({ message: 'Record deleted' });
});

// Get all records (admin)
router.get('/all', authenticate, authorize('admin'), (req, res) => {
  const records = readJSON('records.json');
  res.json({ records });
});

module.exports = router;
