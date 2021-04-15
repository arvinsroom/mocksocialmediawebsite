export default (sequelize, DataTypes) => {
	const Register = sequelize.define("Register", {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4 // create a default UUIDV4 for each record
    },
    profilePic: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    username: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    pageId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'Page'
      },
      type: DataTypes.UUID
    },
    templateId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'Template'
      },
      type: DataTypes.UUID
    },
  }, {
		freezeTableName: true, // model name equal to table name
    timestamps: false, // enable timestamps
	});

  Register.associate = (models) => {
    Register.belongsTo(models.Template, {
      as: 'register',
      foreignKey: 'templateId'
    });
    Register.belongsTo(models.Page, {
      as: 'page',
      foreignKey: 'pageId'
    })
  };

  return Register;
}
