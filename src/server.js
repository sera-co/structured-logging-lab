const express = require('express');
const crypto = require('crypto');
const { connectDb } = require('./db');
const ordersRouter = require('./routes/orders');
const { processPayment } = require('./payment');
const { logger } = require('./logger');

const app = express();
const port = 3000;

app.use((req, res, next) => {
  req.id = crypto.randomUUID();
  req.log = logger.child({ reqId: req.id });
  res.setHeader('X-Request-ID', req.id);
  req.log.info('request.start', { method: req.method, path: req.path });
  next();
});

app.use(express.json());

logger.info('service.start');
connectDb(logger);

app.get('/', (req, res) => {
  req.log.info('healthcheck.success');
  res.send('Orders API is running');
});

app.use('/orders', ordersRouter);

app.post('/payments', (req, res) => {
  processPayment(req.log);
  res.send('Payment processed');
});

app.get('/simulate-error', (req, res) => {
  req.log.error('request.failure', { error: 'simulated failure' });
  res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
  logger.info('service.ready', { port });
});
