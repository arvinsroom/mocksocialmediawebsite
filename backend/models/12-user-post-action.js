export default (sequelize, DataTypes) => {
	const UserPostAction = sequelize.define("UserPostAction", {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4 // create a default UUIDV4 for each record
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
    UserPostAction.belongsTo(models.AdminPost, {
      as: 'adminPosts',
      foreignKey: 'adminPostId',
    });
    // UserPostAction.belongsTo(models.AdminPost, {
    //   as: 'sharePosts',
    //   foreignKey: 'sharePostId',
    // });
    UserPostAction.belongsTo(models.User, {
      foreignKey: 'userId'
    });
  };

  return UserPostAction;
}
