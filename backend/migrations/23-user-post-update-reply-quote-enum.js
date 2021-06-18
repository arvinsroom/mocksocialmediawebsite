export async function up(queryInterface, DataTypes) {
  await queryInterface.changeColumn('UserPost', 'type', {
    type: DataTypes.ENUM('LINK', 'VIDEO', 'PHOTO', 'TEXT', 'SHARE', 'RETWEET', 'REPLYTO', 'QUOTETWEET'),
    allowNull: true
  });
}

export async function down(queryInterface, DataTypes) {
  await queryInterface.changeColumn('UserPost', 'type', {
    type: DataTypes.ENUM('LINK', 'VIDEO', 'PHOTO', 'TEXT', 'SHARE', 'RETWEET'),
    allowNull: true
  });
}
