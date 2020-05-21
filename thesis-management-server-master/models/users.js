'use strict';
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    userCode: {type: DataTypes.STRING, field:'user_code'},
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    numberLogin: {type: DataTypes.INTEGER, field:'number_login'},
    changePassAt: {type: DataTypes.DATE, field:'change_pass_at'},
    role: DataTypes.STRING
  }, {
    tableName: 'users',
    underscored: true,
  });
  Users.associate = function(models) {
    // associations can be defined here
  };
  return Users;
};