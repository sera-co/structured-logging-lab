const service = 'orders-api';

const write = (level, msg, fields = {}) => {
  const entry = {
    ts: new Date().toISOString(),
    level,
    service,
    msg,
    ...fields,
  };

  process.stdout.write(`${JSON.stringify(entry)}\n`);
};

const createLogger = (context = {}) => ({
  child: (childContext) => createLogger({ ...context, ...childContext }),
  info: (msg, fields) => write('info', msg, { ...context, ...fields }),
  warn: (msg, fields) => write('warn', msg, { ...context, ...fields }),
  error: (msg, fields) => write('error', msg, { ...context, ...fields }),
});

const logger = createLogger();

module.exports = { logger };
