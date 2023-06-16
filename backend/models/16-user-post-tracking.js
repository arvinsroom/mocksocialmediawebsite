export default (sequelize, DataTypes) => {
  const UserPostTracking = sequelize.define("UserPostTracking", {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4 // create a default UUIDV4 for each record
    },
    action: {
      allowNull: false,
      type: DataTypes.ENUM('LIKE', 'LINKCLICK', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY', 'TWEET', 'RETWEET', 'REPORT', 'SEEWHY', 'SHAREANYWAY', 'SEEPHOTO', 'SEEVIDEO', 'SEELINK')
      // For now we only use 'LINKCLICK', 'SEEWHY', 'SHAREANYWAY', 'SEEPHOTO', 'SEEVIDEO', 'SEELINK' in the output
    },
    userPostId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'UserPost'
      },
      type: DataTypes.UUID
    },
    userId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'User'
      },
      type: DataTypes.UUID
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.literal('CURRENT_TIMESTAMP(3)'),
      defaultValue: DataTypes.literal('CURRENT_TIMESTAMP(3)'),
    },
  }, {
		freezeTableName: true, // model name equal to table name
    timestamps: false, // enable timestamps
	});

  UserPostTracking.associate = (models) => {
    UserPostTracking.belongsTo(models.UserPost, {
      as: 'userPosts',
      foreignKey: 'userPostId'
    });
    UserPostTracking.belongsTo(models.User, {
      foreignKey: 'userId'
    });
  };

  return UserPostTracking;
}
