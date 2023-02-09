const { Sequelize } = require('sequelize');

export async function down({ context: queryInterface }) {
  await queryInterface.removeColumn("Page", "omitInteractionBar");
}

export async function up({ context: queryInterface }) {
  await queryInterface.addColumn("Page", "omitInteractionBar", {
    allowNull: false,
    defaultValue: false,
    type: Sequelize.BOOLEAN,
  });
}
