const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Faculty = sequelize.define('Faculty', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: true },
  full_name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  phone: { type: DataTypes.STRING(15), allowNull: true },
  department_id: { type: DataTypes.INTEGER, allowNull: true },
  designation: { type: DataTypes.STRING(100), allowNull: true },
}, {
  tableName: 'faculty',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Faculty;
