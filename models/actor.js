'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Actor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Movie}) {
      // define association here
      this.belongsToMany(Movie, { through: 'Cast'});
    }

  };
  Actor.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    birth: {
      type: DataTypes.DATE,
      allowNull: false
    },
    birthPlace: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender: {
      type: DataTypes.CHAR(1),
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Actor',
  });
  return Actor;
};