const { Sequelize } = require('sequelize');

export async function down({ context: queryInterface }) {
  await queryInterface.changeColumn('UserPostTracking', 'action', {
      allowNull: false,
      type: Sequelize.ENUM('LIKE', 'LINKCLICK', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY', 'TWEET', 'RETWEET')
  });
}

export async function up({ context: queryInterface }) {
  await queryInterface.changeColumn('UserPostTracking', 'action', {
      allowNull: false,
      type: Sequelize.ENUM('LIKE', 'LINKCLICK', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY', 'TWEET', 'RETWEET', 'REPORT')
  });
}
