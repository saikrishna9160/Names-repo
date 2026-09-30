const app = require('./app');

const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || '127.0.0.1';

app.listen(port, host, () => {
  console.log(`Name Registry API is running on http://${host}:${port}`);
});
