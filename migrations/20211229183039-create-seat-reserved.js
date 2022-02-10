'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SeatReserveds', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      reservationId: {
        type: Sequelize.INTEGER,
        primaryKey: false,
        references: {
          model: 'Reservations',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      seatId: {
        type: Sequelize.INTEGER,
        primaryKey: false,
        references: {
          model: 'Seats',
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
    await queryInterface.dropTable('SeatReserveds');
  }
};