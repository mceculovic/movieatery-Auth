'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SeatReserved extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Reservation, Showtimes, Seat}) {
      // define association here
      this.belongsTo(Reservation, {as: 'reservation', foreignKey:'reservationId', targetKey:'id'});
      this.belongsTo(Seat, {as: 'seat', foreignKey:'seatId', targetKey:'id'});


    }
  };
  SeatReserved.init({
  }, {
    sequelize,
    modelName: 'SeatReserved',
  });
  return SeatReserved;
};