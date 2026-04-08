require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure data directory and files exist
const dataDir = path.join(__dirname, 'data');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const usersFile = path.join(dataDir, 'users.json');
const recordsFile = path.join(dataDir, 'records.json');

if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, JSON.stringify([]));
if (!fs.existsSync(recordsFile)) fs.writeFileSync(recordsFile, JSON.stringify([]));

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsDir));

// Routes
const authRoutes = require('./routes/auth');
const recordRoutes = require('./routes/records');
const patientRoutes = require('./routes/patients');
const doctorRoutes = require('./routes/doctors');
const adminRoutes = require('./routes/admin');
const qrRoutes = require('./routes/qr');

app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/qr', qrRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'Scanly API is running', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🏥 Scanly Backend running on port ${PORT}`);
});

module.exports = app;
