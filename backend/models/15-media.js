export default (sequelize, DataTypes) => {
	const Media = sequelize.define("Media", {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4 // create a default UUIDV4 for each record
    },
    mimeType: {
      allowNull: false,
      type: DataTypes.STRING
    },
    media: {
      allowNull: false,
      type: DataTypes.BLOB('long')
    },
    isThumbnail: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    userPostId: {
      allowNull: true,
      references: {
        key: '_id',
        model: 'UserPost'
      },
      type: DataTypes.UUID,
      defaultValue: null
    },
    authorId: {
      allowNull: true,
      defaultValue: null,
      type: DataTypes.STRING,
    },
  }, {
		freezeTableName: true, // model name equal to table name
    timestamps: false, // enable timestamps
	});

  Media.associate = (models) => {
    Media.belongsTo(models.UserPost, {
      as: 'attachedMedia',
      foreignKey: 'userPostId'
    });
  };

	return Media;
};
