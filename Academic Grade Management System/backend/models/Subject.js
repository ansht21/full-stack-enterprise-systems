const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Subject = sequelize.define('Subject', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  subject_code: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  subject_name: { type: DataTypes.STRING(100), allowNull: false },
  credits: { type: DataTypes.INTEGER, defaultValue: 3 },
  semester: { type: DataTypes.INTEGER, allowNull: false },
  department_id: { type: DataTypes.INTEGER, allowNull: true },
  faculty_id: { type: DataTypes.INTEGER, allowNull: true },
}, {
  tableName: 'subjects',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Subject;
