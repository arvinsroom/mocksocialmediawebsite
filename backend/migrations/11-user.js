async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('User');
}

async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('User', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUIDV4
    },
    templateId: {
      allowNull: false,
      type: DataTypes.UUIDV4
    },
    qualtricsId: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    // need started at stamp
  });
  await queryInterface.addIndex('User', ['templateId', 'qualtricsId']);
}

module.exports = {
  up,
  down
};