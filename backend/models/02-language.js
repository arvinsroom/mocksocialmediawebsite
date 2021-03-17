export default (sequelize, DataTypes) => {
	const Language = sequelize.define("Language", {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING // 255
    },
    templateId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'Template'
      },
      type: DataTypes.UUID
    },
    code: {
      allowNull: true,
      type: DataTypes.STRING(2) // en, es
    },
    translations: {
      allowNull: false,
      type: DataTypes.TEXT
    }
  }, {
		freezeTableName: true, // model name equal to table name
    timestamps: false, // enable timestamps
	});

  Language.associate = (models) => {
    Language.belongsTo(models.Template, {
      as: 'template',
      foreignKey: 'templateId'
    })
  };

  return Language;
}
