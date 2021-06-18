export default (sequelize, DataTypes) => {
	const User = sequelize.define("User", {
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
    qualtricsId: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    // this will be user response
    consent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    responseCode: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    startedAt: {
      allowNull: false,
      type: DataTypes.literal('CURRENT_TIMESTAMP(3)'),
      defaultValue: DataTypes.literal('CURRENT_TIMESTAMP(3)'),
    },
    finishedAt: {
      allowNull: true,
      type: DataTypes.literal('CURRENT_TIMESTAMP(3)'),
    }
  }, {
		freezeTableName: true, // model name equal to table name
    timestamps: false, // enable timestamps
	});

  // User.associate = (models) => {
  //   User.hasMany(models.AdminPost, {
  //     as: 'userPost',
  //     // sourceKey: '_id'
  //   })
  // };
  // user can have many posts and is connected through
  // userId on target model i.e. UserPost
  // The source key is the attribute on the source model that the foreign key attribute on the target model points to. 
  // By default the source key for a hasOne relation will be the source model's primary attribute. To use a custom attribute, 
  // use the sourceKey option.
  User.associate = (models) => {
    User.hasMany(models.UserRegister, {
      as: 'userRegisterations',
      foreignKey: {
        name: 'userId',
        allowNull: false
      }
    });
    User.hasMany(models.UserAnswer, {
      as: 'userQuestionAnswers',
      foreignKey: {
        name: 'userId',
        allowNull: false
      }
    });
    User.hasMany(models.UserPost, {
      as: 'userPosts',
      foreignKey: {
        name: 'userId',
        allowNull: false
      }
    });
    User.hasMany(models.UserGlobalTracking, {
      as: 'userGlobalTracking',
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
    });
    User.hasMany(models.UserPostTracking, {
      as: 'userPostTracking',
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
    });
    User.hasMany(models.UserPostAction, {
      as: 'userPostActions',
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
    });
    User.belongsTo(models.Template, {
      as: 'template',
      foreignKey: 'templateId'
    });
  };

  return User;
}
