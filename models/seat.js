'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Seat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Theatre, Reservation, SeatReserved}) {
      // define association here
      this.belongsTo(Theatre, {as: 'theatre', foreignKey:'theatreId', targetKey: 'id'});
      this.belongsToMany(Reservation, {as: 'reservations', through: SeatReserved, foreignKey:'id'});
    }
  };
  Seat.init({
    row: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    number:{
      type: DataTypes.INTEGER,
      allowNull: false
    } 
  }, {
    sequelize,
    modelName: 'Seat',
  });
  return Seat;
};