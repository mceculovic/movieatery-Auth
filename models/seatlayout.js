'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SeatLayout extends Model {
    
    static associate({Theatre}) {
      // define association here
      this.belongsTo(Theatre, {as: 'theatre', foreignKey:'theatreId'});
    }
  };
  SeatLayout.init({
    rows: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    numbers:{
      type: DataTypes.INTEGER,
      allowNull: false
    } 
  }, {
    sequelize,
    modelName: 'SeatLayout',
  });
  return SeatLayout;
};