export default (sequelize, DataTypes) => {
  const UserGlobalTracking = sequelize.define("UserGlobalTracking", {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4 // create a default UUIDV4 for each record
    },
    pageId: {
      allowNull: true,
      references: {
        key: '_id',
        model: 'Page'
      },
      type: DataTypes.UUID
    },
    activeTemplateId: {
      allowNull: true,
      references: {
        key: '_id',
        model: 'Template'
      },
      type: DataTypes.UUID
    },
    userId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'User'
      },
      type: DataTypes.UUID
    },
    pageMetaData: {
      allowNull: true,
      type: DataTypes.TEXT,
      defaultValue: null
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.literal('CURRENT_TIMESTAMP(3)'),
      defaultValue: DataTypes.literal('CURRENT_TIMESTAMP(3)'),
    },
  }, {
		freezeTableName: true, // model name equal to table name
    timestamps: false, // enable timestamps
	});

  UserGlobalTracking.associate = (models) => {
    UserGlobalTracking.belongsTo(models.Page, {
      foreignKey: 'pageId',
      as: 'pageConfigurations'
    });
    UserGlobalTracking.belongsTo(models.Template, {
      foreignKey: 'activeTemplateId',
    });
    UserGlobalTracking.belongsTo(models.User, {
      foreignKey: 'userId'
    });
  };
  
  return UserGlobalTracking;
}
