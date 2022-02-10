'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Movies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      releaseYear: {
        type: Sequelize.INTEGER
      },
      rating: {
        type: Sequelize.DOUBLE
      },
      description: {
        type: Sequelize.STRING
      },
      movieLength: {
        type: Sequelize.INTEGER
      },
      genreId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Genres',
          key: 'id'
        },
        onDelete: 'cascade',
      onUpdate: 'cascade',
      },
      imageFileName:{
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
    await queryInterface.dropTable('Movies');
  }
};