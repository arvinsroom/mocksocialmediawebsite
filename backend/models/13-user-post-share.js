export default (sequelize, DataTypes) => {
	const UserPostShare = sequelize.define("UserPostShare", {
    // new post ID, when rendering data in future we should check all the entries from this table 
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
    parentUserPostId: {
      allowNull: true,
      references: {
        key: '_id',
        model: 'UserPost'
      },
      type: DataTypes.UUID
    },
    parentAdminPostId: {
      allowNull: true,
      references: {
        key: '_id',
        model: 'AdminPost'
      },
      type: DataTypes.INTEGER
    },
    shareText: {
      allowNull: true,
      type: DataTypes.TEXT
    },
  }, {
		freezeTableName: true, // model name equal to table name
    timestamps: false, // enable timestamps
	});
  return UserPostShare;
}
