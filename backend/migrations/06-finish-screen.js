async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('FinishScreen');
}

async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('FinishScreen', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    templateId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'Template'
      },
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
    text: {
      allowNull: false,
      type: DataTypes.STRING(1024)
    },
    redirectionLink: {
      allowNull: false,
      type: DataTypes.STRING(1024)
    }
    // also output _id of user table for further analysis, everything should be connected to that id
  });
  // await queryInterface.addIndex('FinishScreen', ['templateId', 'text']);
}

module.exports = {
  up,
  down
};