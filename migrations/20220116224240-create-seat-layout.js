'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SeatLayouts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      rows: {
        type: Sequelize.INTEGER
      },
      numbers: {
        type: Sequelize.INTEGER
      },
      theatreId: {
        type: Sequelize.INTEGER,
        primaryKey: false,
        references: {
          model: 'Theatres',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('SeatLayouts');
  }
};