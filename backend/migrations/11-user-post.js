async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('UserPost');
}

async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('UserPost', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    type: {
      allowNull: true,
      type: DataTypes.ENUM('LINK', 'VIDEO', 'PHOTO', 'TEXT')
    },
    userId: {
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'User'
      },
      type: DataTypes.UUID
    },
    linkTitle: {
      allowNull: true,
      type: DataTypes.STRING(1024)
    },
    link: {
      allowNull: true,
      type: DataTypes.STRING(1024)
    },
    linkPreview: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    postMessage: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    misinformation: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE(3),
    },
  });
  await queryInterface.addIndex('UserPost', ['userId', 'type']);
}

module.exports = {
  up,
  down
};