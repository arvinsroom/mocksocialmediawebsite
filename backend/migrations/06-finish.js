export async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('Finish');
}

export async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('Finish', {
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
    text: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    redirectionLink: {
      allowNull: true,
      type: DataTypes.TEXT
    }
    // also output _id of user table for further analysis, everything should be connected to that id
  });
  await queryInterface.addIndex('Finish', ['templateId', 'pageId']);
}

