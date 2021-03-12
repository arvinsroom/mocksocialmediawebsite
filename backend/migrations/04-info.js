async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('Info');
}

async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('Info', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUIDV4
    },
    templateId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'Template'
      },
      type: DataTypes.UUIDV4
    },
    richText: {
      allowNull: false,
      type: DataTypes.TEXT
    }
  });
  await queryInterface.addIndex('Info', ['templateId', 'richText']);
}

module.exports = {
  up,
  down
};