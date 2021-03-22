async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('McqOption');
}

async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('McqOption', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    questionId: {
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'Question'
      },
      type: DataTypes.UUID
    },
    optionText: {
      allowNull: true,
      type: DataTypes.TEXT
    },
  });
  await queryInterface.addIndex('McqOption', ['questionId']);
}

module.exports = {
  up,
  down
};