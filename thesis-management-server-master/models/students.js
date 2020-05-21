'use strict';
module.exports = (sequelize, DataTypes) => {
  const Students = sequelize.define('Students', {
    userId: {type: DataTypes.INTEGER, field: 'user_id'},
    fullName: {type: DataTypes.STRING, field: 'full_name'},
    gender: {type: DataTypes.STRING, field: 'gender'},
    birthday: {type: DataTypes.STRING, field: 'birthday'},
    address: {type: DataTypes.STRING, field: 'address'},
    phone: {type: DataTypes.STRING, field: 'phone'},
    email: {type: DataTypes.STRING, field: 'email'},
    semesterMark: {type: DataTypes.JSON, field: 'semester_mark'},
    class: {type: DataTypes.STRING, field: 'class'},
    numberCompletedThesis: {type: DataTypes.INTEGER, field: 'number_completed_thesis'},
    describle: {type: DataTypes.TEXT, field: 'describe'},
    numberNewActivity: {type: DataTypes.INTEGER, field: 'number_new_activity'}
  }, {
    tableName: 'students',
    underscored: true,
  });
  Students.associate = function(models) {
    // associations can be defined here
  };
  return Students;
};