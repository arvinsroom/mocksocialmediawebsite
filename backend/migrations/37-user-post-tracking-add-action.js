const { Sequelize } = require('sequelize');

export async function up({ context: queryInterface }) {
  await queryInterface.changeColumn('UserPostTracking', 'action', {
      allowNull: false,
      type: Sequelize.ENUM(
        'LIKE',
        'LINKCLICK',
        'LOVE',
        'HAHA',
        'WOW',
        'SAD',
        'ANGRY',
        'TWEET',
        'RETWEET',
        'REPORT',
        'SEEWHY',
        'SHAREANYWAY',
        'SEEPHOTO',
        'SEEVIDEO',
        'SEELINK'
        )
  });
}

export async function down({ context: queryInterface }) {
  await queryInterface.changeColumn('UserPostTracking', 'action', {
      allowNull: false,
      type: Sequelize.ENUM('LIKE', 'LINKCLICK', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY', 'TWEET', 'RETWEET', 'REPORT')
  });
}
