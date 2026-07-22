const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Enquiry', {
    _id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'resolved'),
      defaultValue: 'pending',
      allowNull: false,
    },
  }, {
    tableName: 'enquiries',
  });
};
