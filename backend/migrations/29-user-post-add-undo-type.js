const { Sequelize } = require('sequelize');

export async function up({ context: queryInterface }) {
  await queryInterface.changeColumn('UserPost', 'type', {
    type: Sequelize.ENUM('LINK', 'VIDEO', 'PHOTO', 'TEXT', 'SHARE', 'RETWEET', 'REPLYTO', 'QUOTETWEET', 'UNDORETWEET'),
    allowNull: true
  });
}

export async function down({ context: queryInterface }) {
  await queryInterface.changeColumn('UserPost', 'type', {
    type: Sequelize.ENUM('LINK', 'VIDEO', 'PHOTO', 'TEXT', 'SHARE', 'RETWEET', 'REPLYTO', 'QUOTETWEET'),
    allowNull: true
  });
}