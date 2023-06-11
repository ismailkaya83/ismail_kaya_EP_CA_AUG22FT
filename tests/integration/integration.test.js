const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const db = require('../../src/models');
const { admin } = require('../fixtures/user.fixture');

setupTestDB();

let loggedInUser;
let loggedInAdmin;

describe('Integration Test', () => {
  describe('Setup Tests', () => {
    describe('POST /api/v1/setup', () => {
      test('should return 201 and successfully setup database', async () => {
        const res = await request(app).post('/api/v1/setup').expect(httpStatus.CREATED);
        expect(res.body.status).toEqual('success');
        expect(res.body.data).toHaveProperty('message');
        expect(res.body.data).toHaveProperty('seed_items_and_categories');
        expect(res.body.data.seed_items_and_categories).toHaveProperty('message');
        expect(res.body.data.seed_items_and_categories).toHaveProperty('categories');
        expect(res.body.data.seed_items_and_categories).toHaveProperty('items');
        expect(res.body.data.seed_items_and_categories.categories).toEqual('Status OK');
        expect(res.body.data.seed_items_and_categories.items).toEqual('Status OK');
        expect(res.body.data).toHaveProperty('roles');
        expect(res.body.data.roles).toHaveProperty('message');
        expect(res.body.data.roles).toHaveProperty('admin_role');
        expect(res.body.data.roles).toHaveProperty('user_role');
        expect(res.body.data.roles.admin_role).toEqual('Status OK');
        expect(res.body.data.roles.user_role).toEqual('Status OK');
        expect(res.body.data).toHaveProperty('users');
        expect(res.body.data.users).toHaveProperty('message');
        expect(res.body.data.users).toHaveProperty('admin');
        expect(res.body.data.users.admin).toEqual('Status OK');
      });

      test('should populate database with roles admin and user', async () => {
        const roles = await db.Role.findAll();
        expect(roles.length).toEqual(2);
        expect(roles[0].name).toEqual('admin');
        expect(roles[0].id).toEqual(1);
        expect(roles[1].name).toEqual('user');
        expect(roles[1].id).toEqual(2);
      });

      test('should populate database with admin user', async () => {
        const adminUser = await db.User.findOne({ where: { username: admin.username } });
        expect(adminUser).toBeDefined();
        expect(adminUser.RoleId).toEqual(1);
        expect(adminUser.username).toEqual(admin.username);
        expect(adminUser.email).toEqual(admin.email);
      });

      test('should populate database with categories', async () => {
        const categories = await db.Category.findAll();
        expect(categories).toBeDefined();
        expect(categories.length).toBeGreaterThan(0);
        // Get a random category
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        expect(randomCategory).toBeDefined();
        expect(randomCategory).toHaveProperty('name');
      });

      test('should populate database with items', async () => {
        const items = await db.Item.findAll();
        expect(items).toBeDefined();
        expect(items.length).toBeGreaterThan(0);
        // Get a random item
        const randomItem = items[Math.floor(Math.random() * items.length)];
        expect(randomItem).toBeDefined();
        expect(randomItem).toHaveProperty('item_name');
        expect(randomItem).toHaveProperty('sku');
        expect(randomItem).toHaveProperty('price');
        expect(randomItem).toHaveProperty('CategoryId');
      });
    });
  });
  describe('Auth Routes Test', () => {
    describe('POST /api/v1/auth/signup', () => {
      let newUser;
      beforeEach(() => {
        newUser = {
          // Remove white spaces from username
          username: faker.name.findName().replace(/\s/g, '').toLowerCase(),
          email: faker.internet.email().toLowerCase(),
          password: 'Password1',
        };
      });
      test('should return 201 and successfully register user', async () => {
        const res = await request(app).post('/api/v1/auth/signup').send(newUser);
        expect(res.body.status).toEqual('success');
        expect(res.body).toHaveProperty('data');
        // User
        expect(res.body.data).toHaveProperty('user');
        expect(res.body.data.user).toHaveProperty('id');
        expect(res.body.data.user).toHaveProperty('username');
        expect(res.body.data.user.username).toEqual(newUser.username);
        expect(res.body.data.user).toHaveProperty('email');
        expect(res.body.data.user.email).toEqual(newUser.email);
        expect(res.body.data).toHaveProperty('tokens');
        expect(res.body.data.tokens).toHaveProperty('access');
        expect(res.body.data.tokens.access).toHaveProperty('token');
        expect(res.body.data.tokens.access).toHaveProperty('expires');
        expect(res.body.data.tokens).toHaveProperty('refresh');
        expect(res.body.data.tokens.refresh).toHaveProperty('token');
        expect(res.body.data.tokens.refresh).toHaveProperty('expires');
        expect(res.body.data.user).not.toHaveProperty('password');
        const dbUser = await db.User.findByPk(res.body.data.user.id);
        expect(dbUser).toBeDefined();
        expect(dbUser.password).not.toBe(newUser.password);
        expect(dbUser.RoleId).toBe(2);
        loggedInUser = {
          id: dbUser.id,
          username: dbUser.username,
          email: dbUser.email,
          password: newUser.password,
          accessToken: res.body.data.tokens.access.token,
        };
      });

      test('should return 400 error if email is invalid', async () => {
        const res = await request(app)
          .post('/api/v1/auth/signup')
          .send({
            username: 'aaaaa',
            email: 'invalidEmail',
            password: loggedInUser.password,
          })
          .expect(httpStatus.BAD_REQUEST);
        expect(res.body.status).toEqual('error');
        expect(res.body.message).toEqual('"email" must be a valid email');
      });

      test('should return 400 error if username already in use', async () => {
        const res = await request(app)
          .post('/api/v1/auth/signup')
          .send({
            username: loggedInUser.username,
            email: faker.internet.email(),
            password: loggedInUser.password,
          })
          .expect(httpStatus.BAD_REQUEST);
        expect(res.body.status).toEqual('error');
        expect(res.body.message).toEqual('Username already taken');
      });

      test('should return 400 error if password empty', async () => {
        const res = await request(app)
          .post('/api/v1/auth/signup')
          .send({
            username: faker.name.findName(),
            email: faker.internet.email(),
            password: '',
          })
          .expect(httpStatus.BAD_REQUEST);
        expect(res.body.status).toEqual('error');
        expect(res.body.message).toEqual('"password" is not allowed to be empty');
      });

      test('should return 400 error if password is too short', async () => {
        const res = await request(app)
          .post('/api/v1/auth/signup')
          .send({
            username: faker.name.findName(),
            email: faker.internet.email(),
            password: 'aaa',
          })
          .expect(httpStatus.BAD_REQUEST);
        expect(res.body.status).toEqual('error');
        expect(res.body.message).toEqual('password must be at least 8 characters');
      });

      test('should return 400 error if password not have at least 1 letter or 1 number', async () => {
        const res = await request(app)
          .post('/api/v1/auth/signup')
          .send({
            username: faker.name.findName(),
            email: faker.internet.email(),
            password: 'aaaaaaaaaaaaa',
          })
          .expect(httpStatus.BAD_REQUEST);
        expect(res.body.status).toEqual('error');
        expect(res.body.message).toEqual('password must contain at least 1 letter and 1 number');
      });
    });

    describe('POST /api/v1/auth/login', () => {
      test('should return 200 and successfully login user', async () => {
        const res = await request(app).post('/api/v1/auth/login').send({
          username: loggedInUser.username.toString(),
          password: loggedInUser.password.toString(),
        });
        expect(res.body.status).toEqual('success');
        expect(res.body).toHaveProperty('data');
        // User
        expect(res.body.data).toHaveProperty('user');
        expect(res.body.data.user).toHaveProperty('id');
        expect(res.body.data.user).toHaveProperty('username');
        expect(res.body.data.user.username).toEqual(loggedInUser.username);
        expect(res.body.data.user).toHaveProperty('email');
        expect(res.body.data.user.email).toEqual(loggedInUser.email);
        expect(res.body.data).toHaveProperty('tokens');
        expect(res.body.data.tokens).toHaveProperty('access');
        expect(res.body.data.tokens.access).toHaveProperty('token');
        expect(res.body.data.tokens.access).toHaveProperty('expires');
        expect(res.body.data.tokens).toHaveProperty('refresh');
        expect(res.body.data.tokens.refresh).toHaveProperty('token');
        expect(res.body.data.tokens.refresh).toHaveProperty('expires');
      });

      test('should return 200 and successfully login admin', async () => {
        const res = await request(app)
          .post('/api/v1/auth/login')
          .send({
            username: admin.username.toString(),
            password: admin.password.toString(),
          })
          .expect(httpStatus.OK);
        expect(res.body.status).toEqual('success');
        expect(res.body).toHaveProperty('data');
        // User
        expect(res.body.data).toHaveProperty('user');
        expect(res.body.data.user).toHaveProperty('id');
        expect(res.body.data.user).toHaveProperty('username');
        expect(res.body.data.user.username).toEqual(admin.username);
        expect(res.body.data.user).toHaveProperty('email');
        expect(res.body.data.user.email).toEqual(admin.email);
        expect(res.body.data).toHaveProperty('tokens');
        expect(res.body.data.tokens).toHaveProperty('access');
        expect(res.body.data.tokens.access).toHaveProperty('token');
        expect(res.body.data.tokens.access).toHaveProperty('expires');
        expect(res.body.data.tokens).toHaveProperty('refresh');
        expect(res.body.data.tokens.refresh).toHaveProperty('token');
        expect(res.body.data.tokens.refresh).toHaveProperty('expires');

        loggedInAdmin = {
          id: res.body.data.user.id,
          username: res.body.data.user.username,
          email: res.body.data.user.email,
          password: admin.password,
          accessToken: res.body.data.tokens.access.token,
        };
      });

      test('should return 401 and if username incorrect', async () => {
        const res = await request(app)
          .post('/api/v1/auth/login')
          .send({
            username: `${loggedInUser.username}n`,
            password: loggedInUser.password,
          })
          .expect(httpStatus.UNAUTHORIZED);
        expect(res.body.status).toEqual('error');
        expect(res.body.message).toEqual('Incorrect username or password');
      });

      test('should return 401 and if password incorrect', async () => {
        const res = await request(app)
          .post('/api/v1/auth/login')
          .send({
            username: loggedInUser.username,
            password: `${loggedInUser.password}n`,
          })
          .expect(httpStatus.UNAUTHORIZED);
        expect(res.body.status).toEqual('error');
        expect(res.body.message).toEqual('Incorrect username or password');
      });
    });
  });

  describe('Category Routes Test', () => {
    test('should return 201 and successfully create category', async () => {
      const existingCategory = await db.Category.findOne({ where: { name: 'CAT_TEST' } });
      if (existingCategory !== null) {
        await db.Item.destroy({ where: { CategoryId: existingCategory.id } });
        await existingCategory.destroy();
      }
      const res = await request(app)
        .post('/api/v1/category')
        .set('Authorization', `Bearer ${loggedInAdmin.accessToken}`)
        .send({
          name: 'CAT_TEST',
        })
        .expect(httpStatus.CREATED);
      expect(res.body.status).toEqual('success');
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data).toHaveProperty('name');
      expect(res.body.data.name).toEqual('CAT_TEST');
      const dbCategory = await db.Category.findByPk(res.body.data.id);
      expect(dbCategory).toBeDefined();
      expect(dbCategory.name).toEqual('CAT_TEST');
    });

    test('should return 403 if a user role creates category', async () => {
      const existingCategory = await db.Category.findOne({ where: { name: 'CAT_TEST_2' } });
      if (existingCategory) {
        await existingCategory.destroy();
      }
      const res = await request(app)
        .post('/api/v1/category')
        .set('Authorization', `Bearer ${loggedInUser.accessToken}`)
        .send({
          name: 'CAT_TEST_2',
        })
        .expect(httpStatus.FORBIDDEN);
      expect(res.body.status).toEqual('error');
      expect(res.body.message).toEqual('Forbidden');
    });
  });

  describe('Item Routes Test', () => {
    test('should return 201 and successfully create item', async () => {
      let existingCategory = await db.Category.findOne({ where: { name: 'CAT_TEST' } });
      if (!existingCategory) {
        existingCategory = await db.Category.create({
          name: 'CAT_TEST',
        });
      }
      const existingItem = await db.Item.findOne({ where: { item_name: 'ITEM_TEST' } });
      if (existingItem) {
        await existingItem.destroy();
      }
      const res = await request(app)
        .post('/api/v1/item')
        .set('Authorization', `Bearer ${loggedInAdmin.accessToken}`)
        .send({
          item_name: 'ITEM_TEST',
          sku: 'ITEM_TEST',
          stock_quantity: 1,
          price: 100,
          img_url: 'http://example.com/image/Sofa.jpg',
          CategoryId: existingCategory.id,
        })
        .expect(httpStatus.CREATED);
      expect(res.body.status).toEqual('success');
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data).toHaveProperty('item_name');
      expect(res.body.data.item_name).toEqual('ITEM_TEST');
      expect(res.body.data).toHaveProperty('sku');
      expect(res.body.data.sku).toEqual('ITEM_TEST');
      expect(res.body.data).toHaveProperty('stock_quantity');
      expect(res.body.data.stock_quantity).toEqual(1);
      expect(res.body.data).toHaveProperty('price');
      expect(res.body.data.price).toEqual(100);
      expect(res.body.data).toHaveProperty('img_url');
      expect(res.body.data).toHaveProperty('CategoryId');
      expect(res.body.data.CategoryId).toEqual(existingCategory.id);
      const dbItem = await db.Item.findByPk(res.body.data.id);
      expect(dbItem).toBeDefined();
      expect(dbItem.item_name).toEqual('ITEM_TEST');
    });
  });

  describe('Search Items Test', () => {
    test('should return 200 and successfully get 3 items with item name mart', async () => {
      const res = await request(app).post('/api/v1/search?item=mart').expect(httpStatus.OK);
      expect(res.body.status).toEqual('success');
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveLength(3);
    });

    test('should return 200 and successfully get 1 items with item name Laptop', async () => {
      const res = await request(app).post('/api/v1/search?item=Laptop').expect(httpStatus.OK);
      expect(res.body.status).toEqual('success');
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0]).toHaveProperty('item_name');
      expect(res.body.data[0].item_name).toEqual('Laptop');
    });
  });

  describe('Admin Endpoints Authorization Test', () => {
    test('should return 403 if a user role creates category', async () => {
      const existingCategory = await db.Category.findOne({ where: { name: 'CAT_TEST_2' } });
      if (existingCategory) {
        await existingCategory.destroy();
      }
      const res = await request(app)
        .post('/api/v1/category')
        .set('Authorization', `Bearer ${loggedInUser.accessToken}`)
        .send({
          name: 'CAT_TEST_2',
        })
        .expect(httpStatus.FORBIDDEN);
      expect(res.body.status).toEqual('error');
      expect(res.body.message).toEqual('Forbidden');
    });

    test('should return 403 if a user role tries to create an item', async () => {
      const res = await request(app)
        .post('/api/v1/item')
        .set('Authorization', `Bearer ${loggedInUser.accessToken}`)
        .send({
          item_name: 'ITEM_TEST_3',
          sku: 'ITEM_TEST_3',
          stock_quantity: 1,
          price: 100,
          img_url: 'http://example.com/image/Sofa.jpg',
          CategoryId: 1,
        })
        .expect(httpStatus.FORBIDDEN);
      expect(res.body.status).toEqual('error');
      expect(res.body.message).toEqual('Forbidden');
    });

    test('should return 403 if a user role tries to delete an item', async () => {
      const res = await request(app)
        .delete('/api/v1/item/1')
        .set('Authorization', `Bearer ${loggedInUser.accessToken}`)
        .expect(httpStatus.FORBIDDEN);
      expect(res.body.status).toEqual('error');
      expect(res.body.message).toEqual('Forbidden');
    });
  });

  describe('Clear Database', () => {
    test('Delete created category and item', async () => {
      const createdCategory = await db.Category.findOne({ where: { name: 'CAT_TEST' } });
      expect(createdCategory).not.toBeNull();
      const createdItem = await db.Item.findOne({ where: { item_name: 'ITEM_TEST', CategoryId: createdCategory.id } });
      expect(createdItem).not.toBeNull();
      await createdItem.destroy();

      const item = await db.Item.findOne({ where: { CategoryId: createdCategory.id } });
      expect(item).toBeNull();
      await createdCategory.destroy();
      const category = await db.Category.findOne({ where: { name: 'CAT_TEST' } });
      expect(category).toBeNull();
    });

    test('Delete user', async () => {
      const user = await db.User.findOne({ where: { username: loggedInUser.username } });
      expect(user).not.toBeNull();
      await user.destroy();
      const deletedUser = await db.User.findOne({ where: { username: loggedInUser.username } });
      expect(deletedUser).toBeNull();
    });
  });

  describe('Re-Setup Tests', () => {
    describe('POST /api/v1/setup', () => {
      test('should return 201 and successfully setup database', async () => {
        const res = await request(app).post('/api/v1/setup').expect(httpStatus.CREATED);
        expect(res.body.status).toEqual('success');
        expect(res.body.data).toHaveProperty('message');
        expect(res.body.data).toHaveProperty('seed_items_and_categories');
        expect(res.body.data.seed_items_and_categories).toHaveProperty('message');
        expect(res.body.data.seed_items_and_categories).toHaveProperty('categories');
        expect(res.body.data.seed_items_and_categories).toHaveProperty('items');
        expect(res.body.data.seed_items_and_categories.categories).toEqual('Status OK');
        expect(res.body.data.seed_items_and_categories.items).toEqual('Status OK');
        expect(res.body.data).toHaveProperty('roles');
        expect(res.body.data.roles).toHaveProperty('message');
        expect(res.body.data.roles).toHaveProperty('admin_role');
        expect(res.body.data.roles).toHaveProperty('user_role');
        expect(res.body.data.roles.admin_role).toEqual('Status OK');
        expect(res.body.data.roles.user_role).toEqual('Status OK');
        expect(res.body.data).toHaveProperty('users');
        expect(res.body.data.users).toHaveProperty('message');
        expect(res.body.data.users).toHaveProperty('admin');
        expect(res.body.data.users.admin).toEqual('Status OK');
      });
    });
  });
});
