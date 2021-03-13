export default (sequelize, DataTypes) => {
	const UserRegister = sequelize.define("UserRegister", {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    profilePic: {
      allowNull: true,
      type: DataTypes.BLOB
    },
    username: {
      allowNull: true,
      type: DataTypes.STRING, // 255
    },
    userId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'User'
      },
      type: DataTypes.UUID
    },
  }, {
		freezeTableName: true, // model name equal to table name
    timestamps: false, // enable timestamps
	});
  return UserRegister;
}
