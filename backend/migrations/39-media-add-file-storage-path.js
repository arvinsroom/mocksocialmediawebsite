const { Sequelize } = require("sequelize");

export async function up({ context: queryInterface }) {
  await queryInterface.addColumn("Media", "mediaPath", {
    allowNull: true,
    defaultValue: null,
    type: Sequelize.STRING(1024),
  });
  await queryInterface.changeColumn("Media", "media", {
    allowNull: true,
    defaultValue: null,
    type: Sequelize.BLOB("long"),
  });
}

export async function down({ context: queryInterface }) {
  await queryInterface.removeColumn("Media", "mediaPath");
  await queryInterface.changeColumn("Media", "media", {
    allowNull: false,
    type: Sequelize.BLOB("long"),
  });
}