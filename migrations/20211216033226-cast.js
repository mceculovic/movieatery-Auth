

'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Cast', {
    
      movieId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Movies',
          key: 'id'
        },
        onDelete: 'cascade',
      onUpdate: 'cascade',
      },
      actorId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Actors',
          key: 'id'
        },
        onDelete: 'cascade',
      onUpdate: 'cascade',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Cast');
  }
};
