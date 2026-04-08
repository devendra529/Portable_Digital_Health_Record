const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');

const readJSON = (filename) => {
  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf-8');
  try { return JSON.parse(raw); } catch { return []; }
};

const writeJSON = (filename, data) => {
  const filePath = path.join(dataDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

module.exports = { readJSON, writeJSON };
