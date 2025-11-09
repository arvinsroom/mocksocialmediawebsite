const { Sequelize } = require("sequelize");

/**
 * Add fields to UserPost for TikTok
 * initShare
 * initBookmark
 * soundName
 */
export async function up({ context: queryInterface }) {
  await queryInterface.addColumn("UserPost", "initShare", {
    allowNull: true,
    type: Sequelize.INTEGER,
  });
  await queryInterface.addColumn("UserPost", "initBookmark", {
    allowNull: true,
    type: Sequelize.INTEGER,
  });
  await queryInterface.addColumn("UserPost", "soundName", {
    allowNull: true,
    type: Sequelize.STRING(255),
  });
}

export async function down({ context: queryInterface }) {
  await queryInterface.removeColumn("UserPost", "initShare");
  await queryInterface.removeColumn("UserPost", "initBookmark");
  await queryInterface.removeColumn("UserPost", "soundName");
}
