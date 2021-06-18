export default (sequelize, DataTypes) => {
	const UserPost = sequelize.define("UserPost", {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4 // create a default UUIDV4 for each record
    },
    adminPostId: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    type: {
      allowNull: true,
      type: DataTypes.ENUM('LINK', 'VIDEO', 'PHOTO', 'TEXT', 'SHARE', 'RETWEET', 'REPLYTO', 'QUOTETWEET')
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
      type: DataTypes.STRING(1024)
    },
    postMessage: {
      allowNull: true,
      type: DataTypes.STRING(1024)
    },
    isFake: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    sourceTweet: {
      allowNull: true,
      type: DataTypes.STRING(1024),
      defaultValue: null
    },
    authorId: {
      allowNull: true,
      references: {
        key: '_id',
        model: 'UserPostAuthor'
      },
      type: DataTypes.INTEGER
    },
    isReplyTo: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    isReplyToOrder: {
      allowNull: true,
      type: DataTypes.SMALLINT
    },
    initLike: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    datePosted: {
      allowNull: true,
      type: DataTypes.STRING
    },
    userId: {
      allowNull: true,
      references: {
        key: '_id',
        model: 'User'
      },
      type: DataTypes.UUID
    },
    parentPostId: {
      allowNull: true,
      references: {
        key: '_id',
        model: 'UserPost'
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
      foreignKey: {
        name: 'userId',
        allowNull: true
      }
    });
    UserPost.belongsTo(models.UserPostAuthor, {
      foreignKey: {
        name: 'authorId',
        allowNull: true
      }
    });
    UserPost.belongsTo(models.UserPost, {
      as: 'parentUserPost',
      foreignKey: 'parentPostId'
    });
    UserPost.belongsTo(models.Page, {
      as: 'page',
      foreignKey: 'pageId'
    });
    UserPost.hasMany(models.Media, {
      as: 'attachedMedia',
      foreignKey: {
        name: 'userPostId',
        allowNull: true
      }
    });
  };

  return UserPost;
}
