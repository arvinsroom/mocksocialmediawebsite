export default (sequelize, DataTypes) => {
	const Language = sequelize.define("Language", {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4 // create a default UUIDV4 for each record
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
    platform: {
      allowNull: false,
      type: DataTypes.STRING
    },
    translations: {
      allowNull: false,
      type: DataTypes.TEXT,
      get () {
        return JSON.parse(this.getDataValue('translations'));
      },
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
