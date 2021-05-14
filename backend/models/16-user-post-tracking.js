export default (sequelize, DataTypes) => {
  const UserPostTracking = sequelize.define("UserPostTracking", {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4 // create a default UUIDV4 for each record
    },
    userPostId: {
      allowNull: true,
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
    action: {
      allowNull: false,
      type: DataTypes.ENUM('LIKE', 'LINKCLICK')
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
