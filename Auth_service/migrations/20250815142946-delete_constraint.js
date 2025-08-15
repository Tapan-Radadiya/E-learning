'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('user_refresh_tokens', 'user_refresh_tokens_user_id_unique')
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addConstraint('user_refresh_tokens', {
      fields: ['user_id'],
      type: 'unique',
      name: 'user_refresh_tokens_user_id_unique',
    })
  }
};
