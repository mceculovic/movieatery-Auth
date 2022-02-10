'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Seat, Showtimes,SeatReserved, User}) {
      // define association here
      this.belongsTo(User, {as: 'user', foreignKey: 'userId', targetKey:'id'});
      this.belongsToMany(Seat, {as: 'seats', through: SeatReserved, foreignKey: 'id'});
      this.belongsTo(Showtimes, {as: 'showtime', foreignKey: 'showtimesId', targetKey:'id' });
    }
  };
  Reservation.init({
    paid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Reservation',
  });
  return Reservation;
};