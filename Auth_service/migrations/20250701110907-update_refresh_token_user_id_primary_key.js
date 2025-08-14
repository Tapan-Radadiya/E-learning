'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('user_refresh_tokens', 'id')
    await queryInterface.addConstraint('user_refresh_tokens', {
      fields: ['user_id'],
      type: 'primary key',
      name: 'user_refresh_token_PK_user_id'
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('user_refresh_tokens', 'user_refresh_token_PK_user_id')
    await queryInterface.addColumn('user_refresh_tokens', 'id', {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: Sequelize.literal('gen_random_uuid()')
    },)
  }
};
