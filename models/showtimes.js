'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Showtimes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Movie, Theatre, Reservation}) {
      this.belongsTo(Movie, { foreignKey: 'movieId', targetKey: 'id'});
      this.belongsTo(Theatre, { foreignKey: 'theatreId', targetKey: 'id'});
      this.hasMany(Reservation, {as: 'reservations', foreignKey: 'id', targetKey:'showtimesId'});
    }
  };
  Showtimes.init({
    startDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ticketPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Showtimes',
  });
  return Showtimes;
};