const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Result = sequelize.define('Result', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  student_id: { type: DataTypes.INTEGER, allowNull: false },
  semester: { type: DataTypes.INTEGER, allowNull: false },
  total_marks: { type: DataTypes.DECIMAL(6, 2), defaultValue: 0 },
  obtained_marks: { type: DataTypes.DECIMAL(6, 2), defaultValue: 0 },
  percentage: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  sgpa: { type: DataTypes.DECIMAL(4, 2), defaultValue: 0 },
  cgpa: { type: DataTypes.DECIMAL(4, 2), defaultValue: 0 },
  status: { type: DataTypes.ENUM('pass', 'fail', 'pending'), defaultValue: 'pending' },
  is_published: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'results',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Result;
