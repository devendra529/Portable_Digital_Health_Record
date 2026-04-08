require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure directories exist
const dataDir = path.join(__dirname, 'data');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Ensure data files exist
const usersFile = path.join(dataDir, 'users.json');
const recordsFile = path.join(dataDir, 'records.json');

if (!fs.existsSync(usersFile)) {
  const adminHash = bcrypt.hashSync('admin123', 12);
  fs.writeFileSync(usersFile, JSON.stringify([
    {
      id: 'admin-001-scanly-demo',
      name: 'Admin User',
      email: 'admin@scanly.app',
      phone: '+91-9999999999',
      password: adminHash,
      role: 'admin',
      verified: true,
      createdAt: new Date().toISOString(),
      qrCode: null,
      avatar: null
    }
  ], null, 2));
  console.log('✅ Admin user created');
}

if (!fs.existsSync(recordsFile)) {
  fs.writeFileSync(recordsFile, JSON.stringify([]));
}

// Middleware
// Handle preflight
app.options('*', cors());

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://scanly-git-main-devendra1529s-projects.vercel.app/'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
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
