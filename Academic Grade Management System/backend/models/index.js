const User = require('./User');
const Department = require('./Department');
const Student = require('./Student');
const Faculty = require('./Faculty');
const Subject = require('./Subject');
const Mark = require('./Mark');
const Result = require('./Result');

// Associations
Department.hasMany(Student, { foreignKey: 'department_id' });
Student.belongsTo(Department, { foreignKey: 'department_id' });

Department.hasMany(Faculty, { foreignKey: 'department_id' });
Faculty.belongsTo(Department, { foreignKey: 'department_id' });

Department.hasMany(Subject, { foreignKey: 'department_id' });
Subject.belongsTo(Department, { foreignKey: 'department_id' });

Faculty.hasMany(Subject, { foreignKey: 'faculty_id' });
Subject.belongsTo(Faculty, { foreignKey: 'faculty_id', as: 'assignedFaculty' });

User.hasOne(Student, { foreignKey: 'user_id' });
Student.belongsTo(User, { foreignKey: 'user_id' });

User.hasOne(Faculty, { foreignKey: 'user_id' });
Faculty.belongsTo(User, { foreignKey: 'user_id' });

Student.hasMany(Mark, { foreignKey: 'student_id' });
Mark.belongsTo(Student, { foreignKey: 'student_id' });

Subject.hasMany(Mark, { foreignKey: 'subject_id' });
Mark.belongsTo(Subject, { foreignKey: 'subject_id' });

Student.hasMany(Result, { foreignKey: 'student_id' });
Result.belongsTo(Student, { foreignKey: 'student_id' });

module.exports = { User, Department, Student, Faculty, Subject, Mark, Result };
