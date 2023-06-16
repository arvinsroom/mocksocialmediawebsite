const { Sequelize } = require('sequelize');

export async function up({ context: queryInterface }) {
  await queryInterface.removeColumn('UserPost', 'handle');
}

export async function down({ context: queryInterface }) {
  await queryInterface.addColumn('UserPost', 'handle', {
    allowNull: true,
    type: Sequelize.STRING
  });
}
