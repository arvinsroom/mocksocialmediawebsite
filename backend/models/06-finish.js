export default (sequelize, DataTypes) => {
	const Finish = sequelize.define("Finish", {
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
    text: {
      allowNull: true,
      type: DataTypes.TEXT,
      defaultValue: null
    },
    redirectionLink: {
      allowNull: true,
      type: DataTypes.TEXT,
      defaultValue: null
    }
    // also output _id of user table for further analysis, everything should be connected to that id
  }, {
		freezeTableName: true, // model name equal to table name
    timestamps: false, // enable timestamps
	});

  Finish.associate = (models) => {
    Finish.belongsTo(models.Template, {
      as: 'template',
      foreignKey: 'templateId'
    })
  };

  Finish.associate = (models) => {
    Finish.belongsTo(models.Page, {
      as: 'page',
      foreignKey: 'pageId'
    })
  };

  return Finish;
}
