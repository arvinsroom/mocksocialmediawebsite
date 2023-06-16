const { Sequelize } = require('sequelize');

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable('UserPostTracking');
}

export async function up({ context: queryInterface }) {
  await queryInterface.createTable('UserPostTracking', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
    },
    action: {
      allowNull: false,
      type: Sequelize.ENUM('LIKE', 'LINKCLICK', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY', 'TWEET', 'RETWEET')
    },
    userPostId: {
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'UserPost'
      },
      type: Sequelize.UUID
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
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE(3),
    }
  });
  await queryInterface.addIndex('UserPostTracking', ['userId', 'userPostId']);
}

