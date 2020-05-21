'use strict';
module.exports = (sequelize, DataTypes) => {
  const Lecturers = sequelize.define('Lecturers', {
    userId: {type: DataTypes.INTEGER, field:'user_id'},
    fullName: {type: DataTypes.STRING, field:'full_name'},
    gender: DataTypes.STRING,
    birthday: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    branch: DataTypes.STRING,
    numberCompletedThesis: {type: DataTypes.INTEGER, field:'number_completed_thesis'},
    describle: DataTypes.TEXT,
    numberNewActivity: {type: DataTypes.INTEGER, field:'number_new_activity'}
  }, {
    tableName:'lecturers',
    underscored: true,
  });
  Lecturers.associate = function(models) {
    // associations can be defined here
  };
  return Lecturers;
};