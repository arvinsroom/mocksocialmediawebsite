async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('Page');
}

async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('Page', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING(36)
    },
    templateId: {
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'Template'
      },
      type: DataTypes.UUID
    },
    pageDataOrder: {
      allowNull: true,
      type: DataTypes.ENUM('DESC', 'ASC', 'RANDOM')
    },
    type: {
      allowNull: false,
      type: DataTypes.ENUM('MCQ', 'OPENTEXT', 'INFO', 'REGISTER', 'FINISH', 'FACEBOOK', 'REDDIT', 'TWITTER', 'INSTAGRAM',
      'YOUTUBE', 'SLACK', 'TIKTOK')
    },
    flowOrder: {
      allowNull: false,
      type: DataTypes.SMALLINT
    },
  });
  await queryInterface.addIndex('Page', ['templateId', 'type']);
}

module.exports = {
  up,
  down
};