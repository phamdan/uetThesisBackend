'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('theses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      thesis_code: {
        type: Sequelize.STRING
      },
      thesis_subject: {
        type: Sequelize.STRING
      },
      student_id: {
        type: Sequelize.INTEGER
      },
      lecturer_id: {
        type: Sequelize.INTEGER
      },
      state: {
        type: Sequelize.STRING
      },
      describle: {
        type: Sequelize.TEXT
      },
      planning: {
        type: Sequelize.JSON
      },
      thesis_mark: {
        type: Sequelize.INTEGER
      },
      university: {
        type: Sequelize.STRING
      },
      branch: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('theses');
  }
};