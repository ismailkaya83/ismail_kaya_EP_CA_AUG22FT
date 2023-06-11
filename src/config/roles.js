const itemPermissions = {
  create: 'createItem',
  read: 'getItem',
  update: 'updateItem',
  delete: 'deleteItem',
};
const categoryPermissions = {
  create: 'createCategory',
  read: 'readCategory',
  update: 'updateCategory',
  delete: 'deleteCategory',
};
const cartPermissions = {
  create: 'createCart',
  read: 'readCart',
  update: 'updateCart',
  delete: 'deleteCart',
  bulkRead: 'bulkReadCart',
};
const orderPermissions = {
  create: 'createOrder',
  read: 'readOrder',
  update: 'updateOrder',
  delete: 'deleteOrder',
  bulkRead: 'bulkReadOrder',
};
const allRoles = {
  guest: [itemPermissions.read, categoryPermissions.read],
  user: [
    itemPermissions.read,
    categoryPermissions.read,
    cartPermissions.create,
    cartPermissions.read,
    cartPermissions.update,
    cartPermissions.delete,
    orderPermissions.create,
    orderPermissions.read,
  ],
  admin: [
    'getUsers',
    'manageUsers',
    'manageSetup',
    itemPermissions.create,
    itemPermissions.read,
    itemPermissions.update,
    itemPermissions.delete,
    categoryPermissions.create,
    categoryPermissions.read,
    categoryPermissions.update,
    categoryPermissions.delete,
    cartPermissions.create,
    cartPermissions.read,
    cartPermissions.update,
    cartPermissions.delete,
    cartPermissions.bulkRead,
    orderPermissions.create,
    orderPermissions.read,
    orderPermissions.update,
    orderPermissions.delete,
    orderPermissions.bulkRead,
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
