const processPayment = (logger) => {
  logger.info('payment.start');
  // Simulate some payment processing
  setTimeout(() => {
    logger.info('payment.success');
  }, 500);
};

module.exports = { processPayment };
