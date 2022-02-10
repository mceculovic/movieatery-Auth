'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Theatre extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Movie, Showtimes, Seat, SeatLayout}) {
      // define association here
      this.belongsToMany(Movie, {as: 'showtimes', through: Showtimes, foreignKey: 'id'});
      this.hasMany(Seat, {as: 'seats'});
      this.hasOne(SeatLayout, {as: 'seatLayout', foreignKey: 'id'});

    }
  };
  Theatre.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imageFileName: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Theatre',
  });
  return Theatre;
};