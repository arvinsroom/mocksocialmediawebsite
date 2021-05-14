export async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('UserRegister');
}

export async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('UserRegister', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
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
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'User'
      },
      type: DataTypes.UUID
    },
    finishedAt: {
      allowNull: false,
      type: DataTypes.DATE(3),
    },
  });
  await queryInterface.addIndex('UserRegister', ['userId', 'registerId']);
}

