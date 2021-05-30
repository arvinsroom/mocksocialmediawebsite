export default (sequelize, DataTypes) => {
	const UserPostAction = sequelize.define("UserPostAction", {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4 // create a default UUIDV4 for each record
    },
    action: {
      allowNull: false,
      type: DataTypes.ENUM('LIKE', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY', 'COMMENT', 'TWEET', 'RETWEET')
    },
    comment: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: null
    },
    userId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'User'
      },
      type: DataTypes.UUID
    },
    userPostId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'UserPost'
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

  UserPostAction.associate = (models) => {
    UserPostAction.belongsTo(models.UserPost, {
      as: 'userPosts',
      foreignKey: 'userPostId'
    });
    UserPostAction.belongsTo(models.User, {
      foreignKey: 'userId'
    });
  };

  return UserPostAction;
}
