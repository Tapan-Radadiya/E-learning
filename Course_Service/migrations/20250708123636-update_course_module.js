'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.addColumn('course_modules', 'completion_percentage', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 10
    })
  },

  async down (queryInterface, Sequelize) {
       queryInterface.removeColumn('course_modules', 'completion_percentage')
  }
};