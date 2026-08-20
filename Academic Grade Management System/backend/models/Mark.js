const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Mark = sequelize.define('Mark', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  student_id: { type: DataTypes.INTEGER, allowNull: false },
  subject_id: { type: DataTypes.INTEGER, allowNull: false },
  semester: { type: DataTypes.INTEGER, allowNull: false },
  internal_marks: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  practical_marks: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  theory_marks: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  total_marks: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  grade: { type: DataTypes.STRING(5), allowNull: true },
  is_locked: { type: DataTypes.BOOLEAN, defaultValue: false },
  entered_by: { type: DataTypes.INTEGER, allowNull: true },
}, {
  tableName: 'marks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Mark;
