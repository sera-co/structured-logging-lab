const { Pool } = require('pg');
const { logger } = require('./logger');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'myuser',
  password: process.env.DB_PASSWORD || 'mypassword',
  database: process.env.DB_NAME || 'ordersdb',
  port: process.env.DB_PORT || 5432,
});

const connectDb = async (log = logger) => {
  log.info('db.connect.start');
  try {
    await pool.query('SELECT NOW()');
    log.info('db.connect.success');
  } catch (err) {
    log.error('db.connect.failure', { error: err.message });
    log.warn('db.connect.retry_pending');
  }
};

const queryDb = async (text, params, log = logger) => {
  log.info('db.query.start');
  const res = await pool.query(text, params);
  log.info('db.query.success');
  return res;
};

module.exports = { connectDb, queryDb, pool };
