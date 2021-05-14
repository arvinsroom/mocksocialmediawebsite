export default (sequelize, DataTypes) => {
	const UserRegister = sequelize.define("UserRegister", {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4 // create a default UUIDV4 for each record
    },
    image: {
      allowNull: true,
      type: DataTypes.BLOB('long')
    },
    mimeType: {
      allowNull: true,
      type: DataTypes.STRING
    },
    generalFieldValue: {
      allowNull: true,
      type: DataTypes.STRING(1024),
    },
    registerId: {
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'Register'
      },
      type: DataTypes.UUID
    },
    userId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'User'
      },
      type: DataTypes.UUID,
    },
    finishedAt: {
      allowNull: false,
      type: DataTypes.literal('CURRENT_TIMESTAMP(3)'),
      defaultValue: DataTypes.literal('CURRENT_TIMESTAMP(3)'),
    },
  }, {
		freezeTableName: true, // model name equal to table name
    timestamps: false, // enable timestamps
	});

  UserRegister.associate = (models) => {
    UserRegister.belongsTo(models.User, {
      foreignKey: 'userId'
    }),
    UserRegister.belongsTo(models.Register, {
      foreignKey: 'registerId'
    })
  };

  return UserRegister;
}
