export async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('UserPostAction');
}

export async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('UserPostAction', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    action: {
      allowNull: false,
      type: DataTypes.ENUM('LIKE', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY', 'COMMENT', 'TWEET', 'RETWEET')
    },
    comment: {
      allowNull: true,
      type: DataTypes.STRING
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE(3),
    },
    userId: {
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'User'
      },
      type: DataTypes.UUID
    },
    userPostId: {
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'UserPost'
      },
      type: DataTypes.UUID
    }
  });
  await queryInterface.addIndex('UserPostAction', ['userPostId', 'userId']);
}

