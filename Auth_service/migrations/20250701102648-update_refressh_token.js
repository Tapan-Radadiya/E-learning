'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.changeColumn('user_refresh_tokens', 'user_id', {
      type: Sequelize.UUID,
      references: {
        model: {
          tableName: 'users',
        },
        key: 'id',
      },
      allowNull: false,
    })

    queryInterface.addConstraint('user_refresh_tokens', {
      fields: ['user_id'],
      type: 'unique',
      name: 'user_refresh_tokens_user_id_unique'
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('user_refresh_tokens', 'user_refresh_tokens_user_id_unique')
    await queryInterface.removeConstraint('user_refresh_tokens', 'user_refresh_tokens_user_id_unique')
  }
};