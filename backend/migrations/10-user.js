async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('User');
}

async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('User', {
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
    qualtricsId: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    consent: {
      allowNull: true,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    startedAt: {
      allowNull: false,
      type: DataTypes.DATE(3),
    },
    finishedAt: {
      allowNull: true,
      type: DataTypes.DATE(3),
    },
  });
  await queryInterface.addIndex('User', ['templateId']);
}

module.exports = {
  up,
  down
};