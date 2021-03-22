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
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'Template'
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
    thumbnail: {
      allowNull: true,
      type: DataTypes.BLOB('long')
    },
    linkPreview: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    postMessage: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    attachedMedia: {
      allowNull: true,
      type: DataTypes.BLOB('long')
    },
    isFake: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
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
    sourceTweet: {
      allowNull: true,
      type: DataTypes.TEXT
    }
  });
  await queryInterface.addIndex('AdminPost', ['templateId', 'pageId', 'type']);
}

module.exports = {
  up,
  down
};