'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('users', 'createdAt'),
        queryInterface.removeColumn('users', 'updatedAt'),
        queryInterface.addColumn('users', 'createdAt', {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('NOW()')
        }),
        queryInterface.addColumn('users', 'updatedAt', {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('NOW()')
        })
      ])
    })
  },

  async down(queryInterface, Sequelize) {

    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('users', 'createdAt'),
        queryInterface.removeColumn('users', 'updatedAt'),
        queryInterface.addColumn('users', 'createdAt', {
          type: Sequelize.TIME,
          allowNull: false,
          defaultValue: Sequelize.literal('NOW()')
        }),
        queryInterface.addColumn('users', 'updatedAt', {
          type: Sequelize.TIME,
          allowNull: false,
          defaultValue: Sequelize.literal('NOW()')
        })
      ])
    })
  }
};
