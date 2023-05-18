const { Sequelize } = require('sequelize');

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable('UserPost');
}

export async function up({ context: queryInterface }) {
  await queryInterface.createTable('UserPost', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
    },
    adminPostId: {
      allowNull: true,
      type: Sequelize.INTEGER
    },
    type: {
      allowNull: true,
      type: Sequelize.ENUM('LINK', 'VIDEO', 'PHOTO', 'TEXT', 'SHARE')
    },
    linkTitle: {
      allowNull: true,
      type: Sequelize.STRING(1024)
    },
    link: {
      allowNull: true,
      type: Sequelize.STRING(1024)
    },
    linkPreview: {
      allowNull: true,
      type: Sequelize.STRING(1024)
    },
    postMessage: {
      allowNull: true,
      type: Sequelize.STRING(1024)
    },
    isFake: {
      allowNull: false,
      type: Sequelize.BOOLEAN,
    },
    sourceTweet: {
      allowNull: true,
      type: Sequelize.STRING(1024)
    },
    parentPostId: {
      allowNull: true,
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'UserPost'
      },
      type: Sequelize.UUID
    },
    pageId: {
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'Page'
      },
      type: Sequelize.UUID
    },
    userId: {
      allowNull: true,
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'User'
      },
      type: Sequelize.UUID
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE(3),
    },
  });
  await queryInterface.addIndex('UserPost', ['userId', 'adminPostId', 'pageId', 'parentPostId']);
}

