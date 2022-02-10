'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Showtimes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      movieId: {
        type: Sequelize.INTEGER,
        primaryKey: false,
        references: {
          model: 'Movies',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
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
      ticketPrice: {
        type: Sequelize.INTEGER
      },
      startDate: {
        type: Sequelize.STRING
      },
      time: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Showtimes');
  }
};