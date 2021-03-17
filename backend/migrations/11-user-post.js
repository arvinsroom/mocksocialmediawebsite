async function down(queryInterface, DataTypes) {
  await queryInterface.dropTable('UserPost');
}

async function up(queryInterface, DataTypes) {
  await queryInterface.createTable('UserPost', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    type: {
      allowNull: true,
      type: DataTypes.ENUM('LINK', 'VIDEO', 'PHOTO', 'TEXT')
    },
    userId: {
      allowNull: false,
      references: {
        key: '_id',
        model: 'User'
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
  // await queryInterface.addIndex('UserPost', ['userId', 'linkTitle']);
}

module.exports = {
  up,
  down
};