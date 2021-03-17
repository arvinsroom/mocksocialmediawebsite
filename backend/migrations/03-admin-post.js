async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('AdminPost');
}

async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('AdminPost', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    type: {
      allowNull: false,
      type: DataTypes.ENUM('LINK', 'VIDEO', 'PHOTO', 'TEXT')
    },
    templateId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'Template'
      },
      type: DataTypes.UUID
    },
    linkTitle: {
      allowNull: false,
      type: DataTypes.STRING(1024)
    },
    link: {
      allowNull: false,
      type: DataTypes.STRING(1024)
    },
    thumbnail: {
      allowNull: false,
      type: DataTypes.BLOB('long')
    },
    linkPreview: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    postMessage: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    attachedMedia: {
      allowNull: false,
      type: DataTypes.BLOB('long')
    },
    misinformation: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    }
  });
  await queryInterface.addIndex('AdminPost', ['templateId', 'type']);
}

module.exports = {
  up,
  down
};