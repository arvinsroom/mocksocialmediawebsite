export async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('UserPostTracking');
}

export async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('UserPostTracking', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    action: {
      allowNull: false,
      type: DataTypes.ENUM('LIKE', 'LINKCLICK', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY', 'TWEET', 'RETWEET')
    },
    userPostId: {
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'UserPost'
      },
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
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE(3),
    }
  });
  await queryInterface.addIndex('UserPostTracking', ['userId', 'userPostId']);
}

