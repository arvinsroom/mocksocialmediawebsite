export async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('Info');
}

export async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('Info', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    templateId: {
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'Template'
      },
      type: DataTypes.UUID
    },
    pageId: {
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'Page'
      },
      type: DataTypes.UUID
    },
    richText: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    consent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    socialMediaPageId: {
      allowNull: true,
      references: {
        key: '_id',
        model: 'Page'
      },
      type: DataTypes.UUID
    }
  });
  await queryInterface.addIndex('Info', ['templateId', 'pageId']);
}

