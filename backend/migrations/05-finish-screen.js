async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('FinishScreen');
}

async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('FinishScreen', {
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
    text: {
      allowNull: false,
      type: DataTypes.STRING(1024)
    },
    redirectionLink: {
      allowNull: false,
      type: DataTypes.STRING(1024)
    }
    // also need finished at time here
  });
  await queryInterface.addIndex('FinishScreen', ['templateId', 'text']);
}

module.exports = {
  up,
  down
};