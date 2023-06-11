const db = require('../../src/models');
const app = require('../../src/app');
const config = require('../../src/config/config');
const logger = require('../../src/config/logger');

let server;

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});

const setupTestDB = () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: false });
    server = app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });
  });

  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });
};

module.exports = setupTestDB;
