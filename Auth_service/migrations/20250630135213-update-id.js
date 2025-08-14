'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'id', {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: Sequelize.literal('gen_random_uuid()')
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'id', {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
    })
  }
};
