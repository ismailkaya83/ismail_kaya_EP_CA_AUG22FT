const httpStatus = require('http-status');
const { default: fetch } = require('node-fetch');
const db = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Seed Roles
 * @returns {Promise}
 */
const _seedRoles = async () => {
  const roles = await db.Role.findAll();
  if (roles.length === 0) {
    await db.Role.bulkCreate([
      {
        name: 'admin',
      },
      {
        name: 'user',
      },
    ]);
    return {
      roles: {
        message: 'Roles seeded successfully',
        admin_role: 'Status OK',
        user_role: 'Status OK',
      },
    };
  }
  const adminRole = await db.Role.findOne({
    where: {
      name: 'admin',
    },
  });
  const userRole = await db.Role.findOne({
    where: {
      name: 'user',
    },
  });
  if (!adminRole) {
    await db.Role.create({
      name: 'admin',
    });
  }
  if (!userRole) {
    await db.Role.create({
      name: 'user',
    });
  }

  return {
    roles: {
      message: 'Roles seeded successfully',
      admin: 'Status OK',
      role: 'Status OK',
    },
  };
};

/**
 * Seed Admin User
 * @returns {Promise}
 */
const _seedAdmin = async () => {
  const adminRole = await db.Role.findOne({
    where: {
      name: 'admin',
    },
  });
  // Seed Admin User
  const admin = await db.User.findOne({
    where: {
      username: process.env.ADMIN_USERNAME_DB,
    },
  });
  if (!admin) {
    await db.User.create({
      username: process.env.ADMIN_USERNAME_DB,
      email: process.env.ADMIN_EMAIL_DB,
      password: process.env.ADMIN_PASSWORD_DB,
      RoleId: adminRole.id,
    });
  }
  return {
    users: {
      message: 'Admin user seeded successfully',
      admin: 'Status OK',
    },
  };
};

/**
 * Fetch Items
 * @returns {Promise}
 */
const _fetchItemsFromExternalResource = async () => {
  try {
    const response = await fetch(process.env.ITEM_SEED_URL);
    const data = await response.json();
    const items = data.data;
    return items;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB setup error. Cant fetch items from external resource');
  }
};

/**
 * Seed Categories and Items
 * @returns {Promise}
 */
const _seedCategoriesAndItems = async () => {
  await db.Category.destroy({ where: {} });
  await db.Item.destroy({ where: {} });
  // Fetch items from external resource
  const items = await _fetchItemsFromExternalResource();
  // Create unique categories from the fetched items
  const fetchedCategories = [...new Set(items.map((item) => item.category))];
  // Create categories
  const categories = await db.Category.bulkCreate(
    fetchedCategories.map((category) => ({
      name: category,
    }))
  );
  // Create items
  await db.Item.bulkCreate(
    items.map((item) => ({
      CategoryId: categories.find((category) => category.name === item.category).id,
      sku: item.sku,
      item_name: item.item_name,
      price: item.price,
      stock_quantity: item.stock_quantity,
      img_url: item.img_url,
    }))
  );
  return {
    seed_items_and_categories: {
      message: 'Items and categories seeded from external resource successfully',
      categories: 'Status OK',
      items: 'Status OK',
    },
  };
};

/**
 * Seed Health Check
 * @returns {Promise}
 */
const _seedHealthCheck = async () => {
  const rolesResult = {
    message: 'Roles found in DB',
    admin_role: 'Status OK',
    user_role: 'Status OK',
  };
  const roles = await db.Role.findAll();
  const adminRole = await db.Role.findOne({
    where: {
      name: 'admin',
    },
  });
  const userRole = await db.Role.findOne({
    where: {
      name: 'user',
    },
  });
  if (roles.length === 0) {
    rolesResult.message = 'No roles found';
    rolesResult.admin_role = 'Status NOTFOUND';
    rolesResult.user_role = 'Status NOTFOUND';
  }
  if (!adminRole && userRole) {
    rolesResult.message = 'Admin role not found';
    rolesResult.admin_role = 'Status NOTFOUND';
    rolesResult.user_role = 'Status OK';
  }
  if (adminRole && !userRole) {
    rolesResult.message = 'User role not found';
    rolesResult.admin_role = 'Status OK';
    rolesResult.user_role = 'Status NOTFOUND';
  }
  const admin = await db.User.findOne({
    where: {
      RoleId: adminRole.id,
    },
  });
  const usersMessage = {
    message: 'Admin user found in DB',
    admin: 'Status OK',
  };
  if (!admin) {
    usersMessage.message = 'Admin user not found in DB';
    usersMessage.admin = 'Status NOTFOUND';
  }
  const categories = await db.Category.findAll();
  const items = await db.Item.findAll();
  const catMessage = categories.length > 0 ? 'Categories found in DB' : 'No categories found in DB';
  const itemsMessage = items.length > 0 ? 'Items found in DB' : 'No items found in DB';
  const itemsAndCategoriesMessage = {
    message: `${catMessage} and ${itemsMessage}`,
    categories: categories.length > 0 ? 'Status OK' : 'Status NOTFOUND',
    items: items.length > 0 ? 'Status OK' : 'Status NOTFOUND',
  };
  return {
    message: 'Health check status',
    seed_items_and_categories: itemsAndCategoriesMessage,
    roles: rolesResult,
    users: usersMessage,
  };
};

const _shouldSeedDataBase = async () => {
  const dbItems = await db.Item.findAll();
  return dbItems.length === 0;
};

/**
 * Setup DB
 * @returns {Promise}
 */
const setupDB = async () => {
  if (await _shouldSeedDataBase()) {
    const { seed_items_and_categories } = await _seedCategoriesAndItems();
    const { roles } = await _seedRoles();
    const { users } = await _seedAdmin();
    return {
      message: 'DB setup successful',
      seed_items_and_categories,
      roles,
      users,
    };
  }
  // Health check
  const healthCheck = await _seedHealthCheck();
  return healthCheck;
};

module.exports = {
  setupDB,
};
