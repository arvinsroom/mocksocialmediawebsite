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
    platform: {
      allowNull: false,
      type: DataTypes.ENUM('FACEBOOK') // 'REDDIT', 'TWITTER', 'INSTAGRAM'
    },
    action: {
      allowNull: false,
      type: DataTypes.ENUM('LIKE', 'COMMENT') // 'UPVOKE', 'TWEET', 'LOVE'
    },
    comment: {
      allowNull: true,
      type: DataTypes.TEXT
    },
  }, {
		freezeTableName: true, // model name equal to table name
    timestamps: false, // enable timestamps
	});
  return UserPostAction;
}
