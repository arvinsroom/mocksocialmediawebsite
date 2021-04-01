export default (sequelize, DataTypes) => {
	const UserPost = sequelize.define("UserPost", {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4 // create a default UUIDV4 for each record
    },
    type: {
      allowNull: true,
      type: DataTypes.ENUM('LINK', 'VIDEO', 'PHOTO', 'TEXT')
    },
    userId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'User'
      },
      type: DataTypes.UUID
    },
    linkTitle: {
      allowNull: false,
      type: DataTypes.STRING(1024)
    },
    link: {
      allowNull: false,
      type: DataTypes.STRING(1024)
    },
    linkPreview: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    postMessage: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    misinformation: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    }
  }, {
		freezeTableName: true, // model name equal to table name
    timestamps: false, // enable timestamps
	});

  UserPost.associate = (models) => {
    UserPost.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId'
    })
  };

  // UserPost.associate = (models) => {
  //   UserPost.hasMany(models.Media, {
  //     as: 'attachedMediaUser',
  //     foreignKey: {
  //       name: 'userPostId',
  //       allowNull: true
  //     }
  //   })
  // };

  return UserPost;
}
