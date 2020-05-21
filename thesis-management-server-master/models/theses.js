'use strict';
module.exports = (sequelize, DataTypes) => {
  const Theses = sequelize.define('Theses', {
    thesisCode: {type: DataTypes.STRING, field:'thesis_code'},
    thesisSubject: {type: DataTypes.STRING, field:'thesis_subject'},
    studentId: {type: DataTypes.INTEGER, field:'student_id'},
    lecturerId: {type: DataTypes.INTEGER, field:'lecturer_id'},
    state: DataTypes.STRING,
    describle: DataTypes.TEXT,
    planning: DataTypes.JSON,
    thesisMark: {type: DataTypes.INTEGER, field:'thesis_mark'},
    university: DataTypes.STRING,
    branch: DataTypes.STRING
  }, {
    tableName:'theses',
    underscored: true,
  });
  Theses.associate = function(models) {
    // associations can be defined here
  };
  return Theses;
};