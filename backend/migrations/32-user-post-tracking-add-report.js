export async function down(queryInterface, DataTypes) {
  await queryInterface.changeColumn('UserPostTracking', 'action', {
      allowNull: false,
      type: DataTypes.ENUM('LIKE', 'LINKCLICK', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY', 'TWEET', 'RETWEET')
  });
}

export async function up(queryInterface, DataTypes) {
  await queryInterface.changeColumn('UserPostTracking', 'action', {
      allowNull: false,
      type: DataTypes.ENUM('LIKE', 'LINKCLICK', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY', 'TWEET', 'RETWEET', 'REPORT')
  });
}
