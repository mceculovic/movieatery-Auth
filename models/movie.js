'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Actor, Director, Theatre, Showtimes, Genre}) {
      // define association here
      this.belongsToMany(Actor, { through: 'Cast'});
      this.belongsToMany(Director, {through: 'Directs'});
      this.belongsToMany(Theatre, {as: 'showtimes', through: Showtimes, foreignKey: 'id'});
      this.belongsTo(Genre, {as: 'genre', foreignKey: 'genreId', targetKey:'id' });
    }
  };
  Movie.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,

    },
    releaseYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
      
    },
    rating: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      
    },
    movieLength: {
      type: DataTypes.INTEGER,
      allowNull: false,
      
    },
    imageFileName: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Movie',
  });
  return Movie;
};