export async function up(queryInterface, DataTypes) {
  await queryInterface.addColumn('UserPost', 'quoteTweetTo', {
    allowNull: true,
    type: DataTypes.STRING,
    defaultValue: null
  });
  await queryInterface.addColumn('UserPost', 'initReply', {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0,
  });
  await queryInterface.addColumn('UserPost', 'initTweet', {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0,
  });
  await queryInterface.changeColumn("UserPost", "isReplyToOrder", {
    allowNull: true,
    type: DataTypes.STRING,
    defaultValue: null
  });
  await queryInterface.changeColumn("UserPost", "isReplyTo", {
    allowNull: true,
    type: DataTypes.STRING,
    defaultValue: null
  });
  await queryInterface.changeColumn('UserPost', 'initLike', {
    allowNull: true,
    type: DataTypes.INTEGER,
    defaultValue: 0,
  });
}

export async function down(queryInterface, DataTypes) {
  await queryInterface.removeColumn('UserPost', 'quoteTweetTo');
  await queryInterface.removeColumn('UserPost', 'initReply');
  await queryInterface.removeColumn('UserPost', 'initTweet');
  await queryInterface.changeColumn("UserPost", "isReplyToOrder", {
    allowNull: true,
    type: DataTypes.INTEGER
  });
  await queryInterface.changeColumn("UserPost", "isReplyTo", {
    allowNull: true,
    type: DataTypes.INTEGER
  });
  await queryInterface.changeColumn("UserPost", "initLike", {
    allowNull: true,
    type: DataTypes.INTEGER
  });
}
