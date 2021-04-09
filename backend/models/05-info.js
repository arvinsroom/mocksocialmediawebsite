export default (sequelize, DataTypes) => {
	const Info = sequelize.define("Info", {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4 // create a default UUIDV4 for each record
    },
    templateId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'Template'
      },
      type: DataTypes.UUID
    },
    pageId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'Page'
      },
      type: DataTypes.UUID
    },
    richText: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    consent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {
		freezeTableName: true, // model name equal to table name
    timestamps: false, // enable timestamps
	});

  Info.associate = (models) => {
    Info.belongsTo(models.Template, {
      as: 'template',
      foreignKey: 'templateId'
    })
  };

  Info.associate = (models) => {
    Info.belongsTo(models.Page, {
      as: 'page',
      foreignKey: 'pageId'
    })
  };

  return Info;
}
