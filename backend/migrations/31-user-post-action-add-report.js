export async function down(queryInterface, DataTypes) {
  await queryInterface.changeColumn('UserPostAction', 'action', {
      allowNull: false,
      type: DataTypes.ENUM('LIKE', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY', 'COMMENT', 'TWEET', 'RETWEET')
  });
}

export async function up(queryInterface, DataTypes) {
  await queryInterface.changeColumn('UserPostAction', 'action', {
      allowNull: false,
      type: DataTypes.ENUM('LIKE', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY', 'COMMENT', 'TWEET', 'RETWEET', 'REPORT')
  });
}
