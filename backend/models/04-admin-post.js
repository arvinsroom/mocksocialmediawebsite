export default (sequelize, DataTypes) => {
	const AdminPost = sequelize.define("AdminPost", {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    type: {
      allowNull: false,
      type: DataTypes.ENUM('LINK', 'VIDEO', 'PHOTO', 'TEXT')
    },
    templateId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'Template'
      },
      type: DataTypes.UUID
    },
    linkTitle: {
      allowNull: true,
      type: DataTypes.STRING(1024)
    },
    link: {
      allowNull: true,
      type: DataTypes.STRING(1024)
    },
    linkPreview: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    postMessage: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    isFake: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
      defaultValue: false // not fake
    },
    pageId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'Page'
      },
      type: DataTypes.UUID
    },
    sourceTweet: {
      allowNull: true,
      type: DataTypes.TEXT
    }
  }, {
		freezeTableName: true, // model name equal to table name
    timestamps: false, // enable timestamps
	});

  AdminPost.associate = (models) => {
    AdminPost.belongsTo(models.Template, {
      as: 'template',
      foreignKey: 'templateId'
    })
  };

  AdminPost.associate = (models) => {
    AdminPost.belongsTo(models.Page, {
      as: 'page',
      foreignKey: 'pageId'
    })
  };

  AdminPost.associate = (models) => {
    AdminPost.hasMany(models.Media, {
      as: 'attachedMediaAdmin',
      foreignKey: {
        name: 'adminPostId',
        allowNull: true
      }
    })
  };

  return AdminPost;
}
