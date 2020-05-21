'use strict';
module.exports = (sequelize, DataTypes) => {
  const Activities = sequelize.define('Activities', {
    userId: {type: DataTypes.INTEGER, field:'user_id'},
    content: DataTypes.TEXT,
    state: DataTypes.STRING,
    creatorId: {type: DataTypes.INTEGER, field:'creator_id'}
  }, {
    tableName:'activities',
    underscored: true,
  });
  Activities.associate = function(models) {
    // associations can be defined here
  };
  return Activities;
};