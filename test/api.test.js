const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

const app = require('../src/app');
const { initDatabase } = require('../src/database/db');

test('initDatabase uses MySQL config when MYSQL_* env values are provided', () => {
  const previousEnv = { ...process.env };

  process.env.MYSQL_HOST = 'demo-db.amazonaws.com';
  process.env.MYSQL_PORT = '3306';
  process.env.MYSQL_USER = 'app_user';
  process.env.MYSQL_PASSWORD = 'secret';
  process.env.MYSQL_DATABASE = 'name_registry';
  delete process.env.DATABASE_URL;

  try {
    const config = initDatabase();
    assert.equal(config.type, 'mysql');
    assert.equal(config.host, 'demo-db.amazonaws.com');
    assert.equal(config.database, 'name_registry');
  } finally {
    process.env = previousEnv;
  }
});

test('GET /health returns healthy status', async () => {
  const response = await request(app).get('/health');

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { status: 'healthy' });
});

test('GET /api/names returns empty array initially', async () => {
  const response = await request(app).get('/api/names');

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, []);
});

test('POST /api/names adds a new name and returns it', async () => {
  const response = await request(app)
    .post('/api/names')
    .send({ name: 'Sai Krishna' });

  assert.equal(response.status, 201);
  assert.equal(response.body.name, 'Sai Krishna');
  assert.ok(response.body.id);
});

test('GET /api/names returns persisted names', async () => {
  await request(app).post('/api/names').send({ name: 'Jane Doe' });
  const response = await request(app).get('/api/names');

  assert.equal(response.status, 200);
  assert.equal(response.body.length >= 2, true);
  assert.ok(response.body.some((entry) => entry.name === 'Sai Krishna'));
  assert.ok(response.body.some((entry) => entry.name === 'Jane Doe'));
});

test('DELETE /api/names/:id removes the selected name', async () => {
  const added = await request(app).post('/api/names').send({ name: 'Delete Me' });
  const response = await request(app).delete(`/api/names/${added.body.id}`);

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { message: 'Name deleted successfully' });

  const list = await request(app).get('/api/names');
  assert.ok(list.body.every((entry) => entry.id !== added.body.id));
});
