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
      allowNull: true,
      references: {
        key: '_id',
        model: 'UserPost'
      },
      type: DataTypes.UUID
    },
    adminPostId: {
      allowNull: true,
      references: {
        key: '_id',
        model: 'AdminPost'
      },
      type: DataTypes.INTEGER
    },
    // sharePostId: {
    //   allowNull: true,
    //   references: {
    //     key: '_id',
    //     model: 'UserPostShare'
    //   },
    //   type: DataTypes.UUID
    // },
    platform: {
      allowNull: false,
      type: DataTypes.ENUM('FACEBOOK', 'REDDIT', 'TWITTER', 'INSTAGRAM', 'YOUTUBE', 'SLACK', 'TIKTOK')
    },
    action: {
      allowNull: false,
      type: DataTypes.ENUM('LIKE', 'COMMENT', 'UPVOKE', 'TWEET', 'LOVE')
    },
    comment: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE(3),
    },
  });
  await queryInterface.addIndex('UserPostAction', ['userPostId', 'adminPostId']);
}

