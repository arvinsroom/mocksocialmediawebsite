export async function up(queryInterface, DataTypes) {
  await queryInterface.addColumn('UserPost', 'authorId', {
    allowNull: true,
    type: DataTypes.INTEGER
  });
  await queryInterface.addColumn('UserPost', 'isReplyTo', {
    allowNull: true,
    type: DataTypes.INTEGER
  });
  await queryInterface.addColumn('UserPost', 'isReplyToOrder', {
    allowNull: true,
    type: DataTypes.SMALLINT
  });
  await queryInterface.addColumn('UserPost', 'initLike', {
    allowNull: true,
    type: DataTypes.INTEGER
  });
  await queryInterface.addColumn('UserPost', 'datePosted', {
    allowNull: true,
    type: DataTypes.STRING
  });
  await queryInterface.addColumn('UserPost', 'handle', {
    allowNull: true,
    type: DataTypes.STRING
  });
  await queryInterface.changeColumn('UserPost', 'type', {
    type: DataTypes.ENUM('LINK', 'VIDEO', 'PHOTO', 'TEXT', 'SHARE', 'RETWEET'),
    allowNull: true
  });
}

export async function down(queryInterface, DataTypes) {
  await queryInterface.removeColumn('UserPost', 'authorId');
  await queryInterface.removeColumn('UserPost', 'isReplyTo');
  await queryInterface.removeColumn('UserPost', 'isReplyToOrder');
  // use it for comment in fb and twitter
  await queryInterface.removeColumn('UserPost', 'initLike');
  await queryInterface.removeColumn('UserPost', 'datePosted');
  await queryInterface.removeColumn('UserPost', 'handle');
  await queryInterface.changeColumn('UserPost', 'type', {
    type: DataTypes.ENUM('LINK', 'VIDEO', 'PHOTO', 'TEXT', 'SHARE'),
    allowNull: true
  });
}
