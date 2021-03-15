async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('Question');
}

async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('Question', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    pageId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'Page'
      },
      type: DataTypes.UUID
    },
    questionText: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    required: {
      defaultValue: true,
      type: DataTypes.BOOLEAN,
    }
  });
  // await queryInterface.addIndex('Question', ['pageId', 'questionText']);
}

module.exports = {
  up,
  down
};