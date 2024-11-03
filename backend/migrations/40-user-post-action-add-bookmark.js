const { Sequelize } = require("sequelize");

export async function down({ context: queryInterface }) {
  await queryInterface.changeColumn("UserPostAction", "action", {
    allowNull: false,
    type: Sequelize.ENUM(
      "LIKE",
      "LOVE",
      "HAHA",
      "WOW",
      "SAD",
      "ANGRY",
      "COMMENT",
      "TWEET",
      "RETWEET",
      "REPORT",
    ),
  });
}

export async function up({ context: queryInterface }) {
  await queryInterface.changeColumn("UserPostAction", "action", {
    allowNull: false,
    type: Sequelize.ENUM(
      "LIKE",
      "LOVE",
      "HAHA",
      "WOW",
      "SAD",
      "ANGRY",
      "COMMENT",
      "TWEET",
      "RETWEET",
      "REPORT",
      "BOOKMARK",
    ),
  });
}
