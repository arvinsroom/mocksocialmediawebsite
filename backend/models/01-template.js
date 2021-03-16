export default (sequelize, DataTypes) => {
	const Template = sequelize.define("Template", {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4 // create a default UUIDV4 for each record
    },
    adminId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'Admin'
      },
      type: DataTypes.UUID
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING(36)
    },
    randomPosts: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    type: {
      allowNull: false,
      type: DataTypes.ENUM('FACEBOOK') // 'REDDIT', 'TWITTER', 'INSTAGRAM'
    },
    videoPermission: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    audioPermission: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    cookiesPermission: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    qualtricsId: {
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    // flow?? is a {
    //   type: 'of component',
    //   _id: 'reference to know what to fetch',
    // }
    flow: {
      allowNull: false,
      type: DataTypes.TEXT, // json object implement sutible getter and setters, if needed
    }
  }, {
		freezeTableName: true, // model name equal to table name
    timestamps: false, // enable timestamps
	});

  Template.associate = (models) => {
    Template.belongsTo(models.Admin, {
      as: 'admin',
      foreignKey: 'adminId'
    })
  };

  return Template;
}