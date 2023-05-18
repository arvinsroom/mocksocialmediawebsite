const { Sequelize } = require('sequelize');

export async function up({ context: queryInterface }) {
  await queryInterface.addColumn('UserPost', 'authorId', {
    allowNull: true,
    type: Sequelize.INTEGER
  });
  await queryInterface.addColumn('UserPost', 'isReplyTo', {
    allowNull: true,
    type: Sequelize.INTEGER
  });
  await queryInterface.addColumn('UserPost', 'isReplyToOrder', {
    allowNull: true,
    type: Sequelize.SMALLINT
  });
  await queryInterface.addColumn('UserPost', 'initLike', {
    allowNull: true,
    type: Sequelize.INTEGER
  });
  await queryInterface.addColumn('UserPost', 'datePosted', {
    allowNull: true,
    type: Sequelize.STRING
  });
  await queryInterface.addColumn('UserPost', 'handle', {
    allowNull: true,
    type: Sequelize.STRING
  });
  await queryInterface.changeColumn('UserPost', 'type', {
    type: Sequelize.ENUM('LINK', 'VIDEO', 'PHOTO', 'TEXT', 'SHARE', 'RETWEET'),
    allowNull: true
  });
}

export async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('UserPost', 'authorId');
  await queryInterface.removeColumn('UserPost', 'isReplyTo');
  await queryInterface.removeColumn('UserPost', 'isReplyToOrder');
  // use it for comment in fb and twitter
  await queryInterface.removeColumn('UserPost', 'initLike');
  await queryInterface.removeColumn('UserPost', 'datePosted');
  await queryInterface.removeColumn('UserPost', 'handle');
  await queryInterface.changeColumn('UserPost', 'type', {
    type: Sequelize.ENUM('LINK', 'VIDEO', 'PHOTO', 'TEXT', 'SHARE'),
    allowNull: true
  });
}
