async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('Page');
}

async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('Page', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUIDV4
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING(36)
    },
    templateId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'Template'
      },
      type: DataTypes.UUIDV4
    },
    type: {
      allowNull: false,
      type: DataTypes.ENUM('MCQ', 'OPENTEXT')
    },
  });
  await queryInterface.addIndex('Page', ['templateId', 'name']);
}

module.exports = {
  up,
  down
};