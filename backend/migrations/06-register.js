async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('Register');
}

async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('Register', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUIDV4
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
    templateId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'Template'
      },
      type: DataTypes.UUIDV4
    },
  });
  await queryInterface.addIndex('Register', ['templateId', 'name']);
}

module.exports = {
  up,
  down
};