
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Reservation}) {
      // define association here
      this.hasMany(Reservation, {as: 'reservation', foreignKey:'id', targetKey: 'id'});
    }
  };
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Not an email"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isAdmin:{
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    isModerator:{
      type: DataTypes.BOOLEAN,
      allowNull: true,
    }
 
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};