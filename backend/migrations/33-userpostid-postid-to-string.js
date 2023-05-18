const { Sequelize } = require('sequelize');

export async function down({ context: queryInterface }) {
  await queryInterface.changeColumn("UserPost", "adminPostId", {
    allowNull: true,
    type: Sequelize.INTEGER
  });
  await queryInterface.changeColumn("UserPost", "authorId", {
    type: Sequelize.INTEGER
  });
  await queryInterface.changeColumn("UserPostAuthor", "authorId", {
    allowNull: false,
    type: Sequelize.INTEGER
  });
  await queryInterface.changeColumn("Media", "authorId", {
    allowNull: true,
    defaultValue: null,
    type: Sequelize.INTEGER
  });
}

export async function up({ context: queryInterface }) {
  await queryInterface.changeColumn("UserPost", "adminPostId", {
    allowNull: true,
    type: Sequelize.STRING
  });
  await queryInterface.changeColumn("UserPost", "authorId", {
    type: Sequelize.STRING
  });
  await queryInterface.changeColumn("UserPostAuthor", "authorId", {
    allowNull: false,
    type: Sequelize.STRING
  });
  await queryInterface.changeColumn("Media", "authorId", {
    allowNull: true,
    defaultValue: null,
    type: Sequelize.STRING
  });
}
