export async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('UserGlobalTracking');
}

export async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('UserGlobalTracking', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    pageId: {
      allowNull: true,
      references: {
        key: '_id',
        model: 'Page'
      },
      type: DataTypes.UUID
    },
    activeTemplateId: {
      allowNull: true,
      references: {
        key: '_id',
        model: 'Template'
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
    pageFlowOrder: {
      allowNull: true,
      type: DataTypes.TEXT,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE(3),
    },
  });
  await queryInterface.addIndex('UserGlobalTracking', ['userId']);
}

