export default (sequelize, DataTypes) => {
	const UserPostAuthor = sequelize.define("UserPostAuthor", {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4 // create a default UUIDV4 for each record
    },
    authorId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    authorName: {
      allowNull: false,
      type: DataTypes.STRING(1024)
    },
    authorVerified: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    },
    totalPosts: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    totalFollowing: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    totalFollower: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    handle: {
      allowNull: true,
      type: DataTypes.STRING
    },
    pageId: {
      allowNull: false, // ???
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'Page'
      },
      type: DataTypes.UUID
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE(3),
      defaultValue: DataTypes.literal('CURRENT_TIMESTAMP(3)'),
    }
  }, {
    freezeTableName: true, // model name equal to table name
    timestamps: false, // enable timestamps
  });

  UserPostAuthor.associate = (models) => {
    UserPostAuthor.belongsTo(models.Page, {
      as: 'page',
      foreignKey: 'pageId'
    });
  };

  return UserPostAuthor;
}

  