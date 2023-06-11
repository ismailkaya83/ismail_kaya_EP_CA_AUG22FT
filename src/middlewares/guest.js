const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { roleRights } = require('../config/roles');
const logger = require('../config/logger');

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }

  req.user = {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    role: user.Role.name,
  };

  logger.info(`User ${user.username} authenticated, role: ${user.Role.name}`);

  if (requiredRights.length) {
    const userRights = roleRights.get(user.Role.name);
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
    if (!hasRequiredRights) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  resolve();
};

const guest =
  (...requiredRights) =>
  async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      return new Promise((resolve, reject) => {
        passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(
          req,
          res,
          next
        );
      })
        .then(() => next())
        .catch((err) => next(err));
    }
    return new Promise((resolve, reject) => {
      if (requiredRights.length) {
        const userRights = roleRights.get('guest');
        const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
        if (!hasRequiredRights) {
          return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
        }
      }
      resolve();
    })
      .then(() => next())
      .catch((err) => next(err));
  };

module.exports = guest;
