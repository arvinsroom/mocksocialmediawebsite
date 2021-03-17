async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('Register');
}

async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('Register', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    profilePic: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    username: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    pageId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'Page'
      },
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
  });
  await queryInterface.addIndex('Register', ['templateId', 'pageId']);
}

module.exports = {
  up,
  down
};