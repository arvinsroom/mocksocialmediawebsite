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
      type: DataTypes.ENUM('MCQ', 'OPENTEXT', 'INFO', 'REGISTER', 'FINISH', 'MEDIA')
    },
  }, {
		freezeTableName: true, // model name equal to table name
    timestamps: false, // enable timestamps
	});

  Page.associate = (models) => {
    Page.hasOne(models.Register, {
      as: 'register',
    })
  };
  Page.associate = (models) => {
    Page.hasOne(models.Finish, {
      as: 'finish',
    })
  };
  Page.associate = (models) => {
    Page.hasOne(models.Info, {
      as: 'info',
    })
  };
  
  Page.associate = (models) => {
    Page.hasMany(models.Question, {
      as: 'question',
    })
  };

  return Page;
}
