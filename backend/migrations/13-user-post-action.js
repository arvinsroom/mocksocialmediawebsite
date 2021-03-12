async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('UserPostAction');
}

async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('UserPostAction', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'User'
      },
      type: DataTypes.UUIDV4
    },
    userPostId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'UserPost'
      },
      type: DataTypes.UUIDV4
    },
    platform: {
      allowNull: false,
      type: DataTypes.ENUM('FACEBOOK', 'REDDIT', 'TWITTER', 'INSTAGRAM')
    },
    action: {
      allowNull: false,
      type: DataTypes.ENUM('LIKE', 'TWEET', 'LOVE', 'COMMENT')
    },
    comment: {
      allowNull: true,
      type: DataTypes.TEXT
    },
  });
  await queryInterface.addIndex('UserPostAction', ['userId', 'userPostId']);
}

module.exports = {
  up,
  down
};