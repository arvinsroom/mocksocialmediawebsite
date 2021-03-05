export default (sequelize, DataTypes) => {
	const Admin = sequelize.define("Admin", {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING(36)
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING(36)
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING(36)
    }
  }, {
		tableName: "Admin",
		freezeTableName: true,
    timestamps: false
	});

	return Admin;
};
