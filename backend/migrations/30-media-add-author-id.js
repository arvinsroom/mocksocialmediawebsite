const { Sequelize } = require('sequelize');

export async function down({ context: queryInterface }) {
  await queryInterface.removeColumn("Media", "authorId");
}

export async function up({ context: queryInterface }) {
  await queryInterface.addColumn("Media", "authorId", {
    allowNull: true,
    defaultValue: null,
    type: Sequelize.STRING,
  });
}
