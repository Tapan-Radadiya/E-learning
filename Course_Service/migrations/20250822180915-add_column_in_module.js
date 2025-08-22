'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('course_modules', 'is_module_live', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('course_modules', 'is_module_live')
  }
};
