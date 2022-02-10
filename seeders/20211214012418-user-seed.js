const bcrypt = require("bcrypt");


'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
   return queryInterface.bulkInsert('Users', [{
      firstName: 'Admin',
      lastName: 'Admin',
      email: 'admin@gmail.com',
      password: bcrypt.hashSync("12345",10),
      isAdmin: true,
      isModerator: true,
      createdAt: new Date(),
      updatedAt: new Date(),

   }]);
  },

  down: async (queryInterface, Sequelize) => {
   return queryInterface.bulkDelete('Users', null, {});
  }
};
