const { Sequelize } = require('sequelize');

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable('UserPostAction');
}

export async function up({ context: queryInterface }) {
  await queryInterface.createTable('UserPostAction', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID
    },
    action: {
      allowNull: false,
      type: Sequelize.ENUM('LIKE', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY', 'COMMENT', 'TWEET', 'RETWEET')
    },
    comment: {
      allowNull: true,
      type: Sequelize.STRING
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE(3),
    },
    userId: {
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'User'
      },
      type: Sequelize.UUID
    },
    userPostId: {
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'UserPost'
      },
      type: Sequelize.UUID
    }
  });
  await queryInterface.addIndex('UserPostAction', ['userPostId', 'userId']);
}

