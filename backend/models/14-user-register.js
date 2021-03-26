export default (sequelize, DataTypes) => {
	const UserRegister = sequelize.define("UserRegister", {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4 // create a default UUIDV4 for each record
    },
    profilePic: {
      allowNull: true,
      type: DataTypes.BLOB('long'),
      defaultValue: null
    },
    username: {
      allowNull: true,
      type: DataTypes.STRING, // 255
      defaultValue: null
    },
    userId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'User'
      },
      type: DataTypes.UUID,
    },
  }, {
		freezeTableName: true, // model name equal to table name
    timestamps: false, // enable timestamps
	});
  return UserRegister;
}
