const { Sequelize } = require('sequelize');

export async function up({ context: queryInterface }) {
  await queryInterface.addColumn('UserPostAuthor', 'handle', {
    allowNull: true,
    type: Sequelize.STRING
  });
}

export async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('UserPostAuthor', 'handle');
}
