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
    misinformation: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
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

  // The target key is the column on the target model that the foreign key column on the source model points to. 
  // By default the target key for a belongsTo relation will be the target model's primary key. To define a custom column,
  // use the targetKey option.

  UserPost.associate = (models) => {
    UserPost.belongsTo(models.User, {
      foreignKey: 'userId',
    });
    UserPost.hasMany(models.Media, {
      as: 'attachedMediaUser',
      foreignKey: {
        name: 'userPostId',
        allowNull: true
      }
    });
  };

  return UserPost;
}
