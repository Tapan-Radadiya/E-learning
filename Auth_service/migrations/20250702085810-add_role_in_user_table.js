'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'user_role', {
      type: Sequelize.ENUM('ADMIN', 'USER'),
      defaultValue: 'USER',
      allowNull: false
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'user_role')
  }
};
