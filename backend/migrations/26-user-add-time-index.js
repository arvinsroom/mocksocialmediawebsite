const { Sequelize } = require('sequelize');

export async function up({ context: queryInterface }) {
  await queryInterface.addIndex('User', ['startedAt']);
}

export async function down({ context: queryInterface }) {
  await queryInterface.removeIndex('User', ['startedAt']);
}
