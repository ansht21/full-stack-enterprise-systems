const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Student = sequelize.define('Student', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: true },
  roll_number: { type: DataTypes.STRING(30), allowNull: false, unique: true },
  full_name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  phone: { type: DataTypes.STRING(15), allowNull: true },
  department_id: { type: DataTypes.INTEGER, allowNull: true },
  semester: { type: DataTypes.INTEGER, defaultValue: 1 },
  batch_year: { type: DataTypes.INTEGER, allowNull: false },
  dob: { type: DataTypes.DATEONLY, allowNull: true },
  address: { type: DataTypes.TEXT, allowNull: true },
  profile_pic: { type: DataTypes.STRING(255), allowNull: true },
}, {
  tableName: 'students',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Student;
