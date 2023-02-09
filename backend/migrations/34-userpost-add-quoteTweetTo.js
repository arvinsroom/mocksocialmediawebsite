const { Sequelize } = require('sequelize');

export async function up({ context: queryInterface }) {
  await queryInterface.addColumn('UserPost', 'quoteTweetTo', {
    allowNull: true,
    type: Sequelize.STRING,
    defaultValue: null
  });
  await queryInterface.addColumn('UserPost', 'initReply', {
    allowNull: false,
    type: Sequelize.INTEGER,
    defaultValue: 0,
  });
  await queryInterface.addColumn('UserPost', 'initTweet', {
    allowNull: false,
    type: Sequelize.INTEGER,
    defaultValue: 0,
  });
  await queryInterface.changeColumn("UserPost", "isReplyToOrder", {
    allowNull: true,
    type: Sequelize.STRING,
    defaultValue: null
  });
  await queryInterface.changeColumn("UserPost", "isReplyTo", {
    allowNull: true,
    type: Sequelize.STRING,
    defaultValue: null
  });
  await queryInterface.changeColumn('UserPost', 'initLike', {
    allowNull: true,
    type: Sequelize.INTEGER,
    defaultValue: 0,
  });
}

export async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('UserPost', 'quoteTweetTo');
  await queryInterface.removeColumn('UserPost', 'initReply');
  await queryInterface.removeColumn('UserPost', 'initTweet');
  await queryInterface.changeColumn("UserPost", "isReplyToOrder", {
    allowNull: true,
    type: Sequelize.INTEGER
  });
  await queryInterface.changeColumn("UserPost", "isReplyTo", {
    allowNull: true,
    type: Sequelize.INTEGER
  });
  await queryInterface.changeColumn("UserPost", "initLike", {
    allowNull: true,
    type: Sequelize.INTEGER
  });
}
