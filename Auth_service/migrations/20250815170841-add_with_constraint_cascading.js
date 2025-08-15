'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('user_refresh_tokens', {
      fields: ['user_id'],
      type: 'unique',
      name: 'user_refresh_tokens_user_id_unique',
    })

    await queryInterface.addConstraint('user_refresh_tokens', {
      fields: ['user_id'],
      type: 'foreign key',
      name: "user_refresh_tokens_user_id_foreign_key",
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'cascade'
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('user_refresh_tokens', 'user_refresh_tokens_user_id_unique')
  }
};
