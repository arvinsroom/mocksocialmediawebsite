export default (sequelize, DataTypes) => {
	const Admin = sequelize.define("Admin", {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING(36)
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
		tableName: "Admin",
		freezeTableName: true,
    timestamps: false
	});

	return Admin;
};
