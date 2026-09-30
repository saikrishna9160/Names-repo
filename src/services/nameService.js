const { initDatabase } = require('../database/db');

const database = initDatabase();
const memoryNames = [];
let nextId = 1;

function formatName(entry) {
  return {
    id: String(entry.id),
    name: entry.name,
    createdAt: new Date(entry.createdAt).toISOString()
  };
}

async function ensureMySqlSchema() {
  if (database.type !== 'mysql' || !database.pool) {
    return;
  }

  const connection = await database.pool.getConnection();
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS names (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } finally {
    connection.release();
  }
}

async function getNames() {
  if (database.type === 'mysql' && database.pool) {
    try {
      await ensureMySqlSchema();
      const [rows] = await database.pool.query(
        'SELECT id, name, created_at AS createdAt FROM names ORDER BY created_at ASC, id ASC'
      );
      return rows.map((entry) => formatName(entry));
    } catch (error) {
      console.warn('MySQL query failed, falling back to in-memory storage:', error.message);
    }
  }

  return memoryNames.map((entry) => ({ ...entry }));
}

async function addName(name) {
  if (database.type === 'mysql' && database.pool) {
    try {
      await ensureMySqlSchema();
      const [result] = await database.pool.execute(
        'INSERT INTO names (name, created_at) VALUES (?, NOW())',
        [name]
      );

      return {
        id: String(result.insertId),
        name,
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.warn('MySQL insert failed, falling back to in-memory storage:', error.message);
    }
  }

  const entry = {
    id: String(nextId++),
    name,
    createdAt: new Date().toISOString()
  };

  memoryNames.push(entry);
  return { ...entry };
}

async function deleteName(id) {
  if (database.type === 'mysql' && database.pool) {
    try {
      await ensureMySqlSchema();
      const [result] = await database.pool.execute('DELETE FROM names WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.warn('MySQL delete failed, falling back to in-memory storage:', error.message);
    }
  }

  const index = memoryNames.findIndex((entry) => entry.id === String(id));

  if (index === -1) {
    return false;
  }

  memoryNames.splice(index, 1);
  return true;
}

module.exports = {
  getNames,
  addName,
  deleteName
};
