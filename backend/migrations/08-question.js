async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('Question');
}

async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('Question', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUIDV4
    },
    pageId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'Page'
      },
      type: DataTypes.UUIDV4
    },
    questionText: {
      allowNull: false,
      type: DataTypes.TEXT
    },
  });
  await queryInterface.addIndex('Question', ['pageId', 'questionText']);
}

module.exports = {
  up,
  down
};