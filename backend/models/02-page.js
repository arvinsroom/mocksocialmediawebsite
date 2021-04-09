export default (sequelize, DataTypes) => {
	const Page = sequelize.define("Page", {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4 // create a default UUIDV4 for each record
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING(36)
    },
    templateId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'Template'
      },
      type: DataTypes.UUID
    },
    type: {
      allowNull: false,
      type: DataTypes.ENUM('MCQ', 'OPENTEXT', 'INFO', 'REGISTER', 'FINISH', 'FACEBOOK', 'REDDIT', 'TWITTER', 'INSTAGRAM',
      'YOUTUBE', 'SLACK', 'TIKTOK')
    },
    pageDataOrder: {
      allowNull: true,
      type: DataTypes.ENUM('DESC', 'ASC', 'RANDOM')
    },
    flowOrder: {
      allowNull: false,
      type: DataTypes.SMALLINT,
      defaultValue: 0
    },
  }, {
		freezeTableName: true, // model name equal to table name
    timestamps: false, // enable timestamps
	});

  // might need to go over them again
  Page.associate = (models) => {
    Page.belongsTo(models.Template, {
      as: 'pageFlowConfigurations',
      foreignKey: 'templateId'
    });
    Page.hasOne(models.Register, {
      as: 'register',
      foreignKey: {
        name: 'pageId',
        allowNull: false
      }
    });
    Page.hasOne(models.Finish, {
      as: 'finish',
      foreignKey: {
        name: 'pageId',
        allowNull: false
      }
    });
    Page.hasOne(models.Info, {
      as: 'info',
      foreignKey: {
        name: 'pageId',
        allowNull: false
      }
    });
    Page.hasOne(models.AdminPost, {
      as: 'adminPost',
      foreignKey: {
        name: 'pageId',
        allowNull: false
      }
    });
    Page.hasMany(models.Question, {
      as: 'question',
      foreignKey: {
        name: 'pageId',
        allowNull: false
      }
    });
  };

  return Page;
}
