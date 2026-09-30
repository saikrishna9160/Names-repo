const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const { initDatabase } = require('./database/db');
const { getNames, addName, deleteName } = require('./services/nameService');

dotenv.config();

const app = express();
const database = initDatabase();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.get('/api/names', async (req, res) => {
  try {
    const names = await getNames();
    res.status(200).json(names);
  } catch (error) {
    console.error('Failed to fetch names:', error.message);
    res.status(500).json({ message: 'Failed to retrieve names' });
  }
});

app.post('/api/names', async (req, res) => {
  const { name } = req.body || {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ message: 'Name is required' });
  }

  try {
    const newName = await addName(name.trim());
    res.status(201).json(newName);
  } catch (error) {
    console.error('Failed to add name:', error.message);
    res.status(500).json({ message: 'Failed to add name' });
  }
});

app.delete('/api/names/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await deleteName(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Name not found' });
    }
    res.status(200).json({ message: 'Name deleted successfully' });
  } catch (error) {
    console.error('Failed to delete name:', error.message);
    res.status(500).json({ message: 'Failed to delete name' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
module.exports.database = database;
