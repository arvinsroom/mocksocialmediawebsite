export async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('McqOption');
}

export async function up(queryInterface, DataTypes) {
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
      allowNull: false,
      type: DataTypes.STRING
    },
    optionOrder: {
      allowNull: false,
      type: DataTypes.SMALLINT
    },
  });
  await queryInterface.addIndex('McqOption', ['questionId']);
}

