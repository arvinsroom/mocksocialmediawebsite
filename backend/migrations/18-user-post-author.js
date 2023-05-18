const { Sequelize } = require('sequelize');

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable('UserPostAuthor');
}

export async function up({ context: queryInterface }) {
  await queryInterface.createTable('UserPostAuthor', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
    },
    authorId: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    authorName: {
      allowNull: false,
      type: Sequelize.STRING(1024)
    },
    authorVerified: {
      allowNull: false,
      type: Sequelize.BOOLEAN,
    },
    totalPosts: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    totalFollowing: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    totalFollower: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    pageId: {
      allowNull: false, // ???
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'Page'
      },
      type: Sequelize.UUID
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE(3),
    },
  });
  await queryInterface.addIndex('UserPostAuthor', ['authorId', 'pageId']);
}
