export async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('Question');
}

export async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('Question', {
    _id: {
      allowNull: false,
      primaryKey: true,
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
    questionText: {
      allowNull: false,
      type: DataTypes.STRING
    },
    required: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    multiResponse: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    order: {
      allowNull: false,
      type: DataTypes.SMALLINT
    }
  });
  await queryInterface.addIndex('Question', ['pageId']);
}

