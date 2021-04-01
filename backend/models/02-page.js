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
    order: {
      allowNull: true,
      type: DataTypes.INTEGER,
      defaultValue: null
    },
  }, {
		freezeTableName: true, // model name equal to table name
    timestamps: false, // enable timestamps
	});

  // might need to go over them again
  Page.associate = (models) => {
    Page.hasMany(models.Register, {
      as: 'register',
    })
  };
  Page.associate = (models) => {
    Page.hasMany(models.Finish, {
      as: 'finish',
    })
  };
  Page.associate = (models) => {
    Page.hasMany(models.Info, {
      as: 'info',
    })
  };
  Page.associate = (models) => {
    Page.hasMany(models.AdminPost, {
      as: 'adminPost',
    })
  };

  
  Page.associate = (models) => {
    Page.hasMany(models.Question, {
      as: 'question',
    })
  };


  return Page;
}
