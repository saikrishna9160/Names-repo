const mysql = require('mysql2/promise');

function parseMysqlUrl(databaseUrl) {
  if (!databaseUrl || !databaseUrl.startsWith('mysql://')) {
    return null;
  }

  try {
    const parsed = new URL(databaseUrl);
    const database = parsed.pathname.replace(/^\/+/, '') || 'name_registry';

    return {
      host: parsed.hostname,
      port: Number(parsed.port || 3306),
      user: decodeURIComponent(parsed.username || 'root'),
      password: decodeURIComponent(parsed.password || ''),
      database: decodeURIComponent(database)
    };
  } catch (error) {
    console.warn('Invalid MySQL DATABASE_URL supplied:', databaseUrl);
    return null;
  }
}

function getMysqlConfig() {
  const mysqlUrlConfig = parseMysqlUrl(process.env.DATABASE_URL);
  if (mysqlUrlConfig) {
    return mysqlUrlConfig;
  }

  if (process.env.MYSQL_HOST) {
    return {
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'name_registry'
    };
  }

  return null;
}

function initDatabase() {
  const mysqlConfig = getMysqlConfig();

  if (!mysqlConfig) {
    return {
      type: 'memory',
      host: null,
      port: null,
      user: null,
      password: null,
      database: null,
      pool: null
    };
  }

  const pool = mysql.createPool({
    host: mysqlConfig.host,
    port: mysqlConfig.port,
    user: mysqlConfig.user,
    password: mysqlConfig.password,
    database: mysqlConfig.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4'
  });

  return {
    type: 'mysql',
    host: mysqlConfig.host,
    port: mysqlConfig.port,
    user: mysqlConfig.user,
    password: mysqlConfig.password,
    database: mysqlConfig.database,
    pool
  };
}

module.exports = {
  initDatabase
};
