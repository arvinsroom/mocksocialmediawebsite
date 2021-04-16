export async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('Template');
}

export async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('Template', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
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
    templateCode: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  });
  await queryInterface.addIndex('Template', ['adminId', 'templateCode']);
}

