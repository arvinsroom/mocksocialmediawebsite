const { Sequelize } = require('sequelize');

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable('Media');
}

export async function up({ context: queryInterface }) {
  await queryInterface.createTable('Media', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID
    },
    mimeType: {
      allowNull: false,
      type: Sequelize.STRING
    },
    media: {
      allowNull: false,
      type: Sequelize.BLOB('long')
    },
    isThumbnail: {
      allowNull: false,
      type: Sequelize.BOOLEAN
    },
    userPostId: {
      allowNull: true,
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'UserPost'
      },
      type: Sequelize.UUID
    }
  });
  await queryInterface.addIndex('Media', ['userPostId']);
}

