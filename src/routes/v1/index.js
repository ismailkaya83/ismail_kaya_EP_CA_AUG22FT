const express = require('express');
const authRoute = require('./auth.route');
const setupRoute = require('./setup.route');
const itemRoute = require('./item.route');
const categoryRoute = require('./category.route');
const cartRoute = require('./cart.route');
const orderRoute = require('./order.route');
const searchRoute = require('./search.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/',
    route: cartRoute,
  },
  {
    path: '/',
    route: orderRoute,
  },
  {
    path: '/',
    route: searchRoute,
  },
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/setup',
    route: setupRoute,
  },
  {
    path: '/items',
    route: itemRoute,
  },
  {
    path: '/item',
    route: itemRoute,
  },
  {
    path: '/categories',
    route: categoryRoute,
  },
  {
    path: '/category',
    route: categoryRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
