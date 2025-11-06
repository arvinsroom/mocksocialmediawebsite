const { Sequelize } = require("sequelize");

export async function up({ context: queryInterface }) {
  // Add new enum value for TikTok dwell tracking
  await queryInterface.changeColumn("UserPostTracking", "action", {
    allowNull: false,
    type: Sequelize.ENUM(
      "LIKE",
      "LINKCLICK",
      "LOVE",
      "HAHA",
      "WOW",
      "SAD",
      "ANGRY",
      "TWEET",
      "RETWEET",
      "REPORT",
      "SEEWHY",
      "SHAREANYWAY",
      "SEEPHOTO",
      "SEEVIDEO",
      "SEELINK",
      "TIKTOK_DWELLTIME",
    ),
  });

  // Add metaData field for storing dwell session details
  await queryInterface.addColumn("UserPostTracking", "metaData", {
    allowNull: true,
    type: Sequelize.TEXT,
    comment: "JSON string for storing dwell session start/end times",
  });
}

export async function down({ context: queryInterface }) {
  // Remove the metaData column
  await queryInterface.removeColumn("UserPostTracking", "metaData");

  // Revert enum to previous values
  await queryInterface.changeColumn("UserPostTracking", "action", {
    allowNull: false,
    type: Sequelize.ENUM(
      "LIKE",
      "LINKCLICK",
      "LOVE",
      "HAHA",
      "WOW",
      "SAD",
      "ANGRY",
      "TWEET",
      "RETWEET",
      "REPORT",
      "SEEWHY",
      "SHAREANYWAY",
      "SEEPHOTO",
      "SEEVIDEO",
      "SEELINK",
    ),
  });
}