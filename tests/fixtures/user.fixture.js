const faker = require('faker');

const password = 'P@ssword123';

const userOne = {
  username: 'userone',
  email: 'userone@test.com',
  password,
  role: 'user',
};

const userTwo = {
  username: 'usertwo',
  email: userOne.email,
  password,
  role: 'user',
};
const userThree = {
  username: 'userthree',
  email: userOne.email,
  password,
  role: 'user',
};
const userFour = {
  username: 'userfour',
  email: userOne.email,
  password,
  role: 'user',
};

const userFive = {
  username: 'userfive',
  email: userOne.email,
  password,
  role: 'user',
};

const admin = {
  username: process.env.ADMIN_USERNAME_DB,
  email: process.env.ADMIN_EMAIL_DB,
  password: process.env.ADMIN_PASSWORD_DB,
  role: 'admin',
};

const randomUser = {
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'user',
};

module.exports = {
  userOne,
  userTwo,
  userThree,
  userFour,
  userFive,
  admin,
  randomUser,
};
