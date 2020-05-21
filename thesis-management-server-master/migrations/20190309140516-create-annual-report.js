'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('annual_reports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      thesis_id: {
        type: Sequelize.INTEGER
      },
      completed: {
        type: Sequelize.TEXT
      },
      incompleted: {
        type: Sequelize.TEXT
      },
      difficulty: {
        type: Sequelize.TEXT
      },
      creator_id: {
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('annual_reports');
  }
};