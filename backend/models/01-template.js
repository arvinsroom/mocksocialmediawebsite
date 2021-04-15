export default (sequelize, DataTypes) => {
	const Template = sequelize.define("Template", {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4 // create a default UUIDV4 for each record
    },
    adminId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'Admin'
      },
      type: DataTypes.UUID
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING(36)
    },
    videoPermission: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    audioPermission: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    cookiesPermission: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    qualtricsId: {
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    templateCode: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {
		freezeTableName: true, // model name equal to table name
    timestamps: false, // enable timestamps
	});

  Template.associate = (models) => {
    Template.belongsTo(models.Admin, {
      as: 'admin',
      foreignKey: 'adminId'
    });
    Template.hasMany(models.Page, {
      as: 'pageFlowConfigurations',
      foreignKey: 'templateId'
    });
    Template.hasMany(models.Register, {
      as: 'register',
      foreignKey: 'templateId'
    });
    Template.hasMany(models.Finish, {
      as: 'finish',
      foreignKey: 'templateId'
    });
    Template.hasMany(models.Info, {
      as: 'info',
      foreignKey: 'templateId'
    });
    Template.hasMany(models.AdminPost, {
      as: 'adminPost',
      foreignKey: 'templateId'
    });
    Template.hasMany(models.Language, {
      as: 'language',
      foreignKey: 'templateId'
    });
    Template.hasMany(models.User, {
      as: 'user',
      foreignKey: 'templateId'
    });
  };

  return Template;
}