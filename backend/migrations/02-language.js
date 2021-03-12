async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('Language');
}

async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('Language', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUIDV4
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING // 255
    },
    templateId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'Template'
      },
      type: DataTypes.UUIDV4
    },
    code: {
      allowNull: true,
      type: DataTypes.STRING(2) // en, es
    },
    translations: {
      allowNull: false,
      type: DataTypes.TEXT
    }
  });
  await queryInterface.addIndex('Language', ['templateId', 'name']);
}

module.exports = {
  up,
  down
};