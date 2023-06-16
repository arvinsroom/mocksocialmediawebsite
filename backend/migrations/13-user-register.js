const { Sequelize } = require('sequelize');

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable('UserRegister');
}

export async function up({ context: queryInterface }) {
  await queryInterface.createTable('UserRegister', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID
    },
    image: {
      allowNull: true,
      type: Sequelize.BLOB('long')
    },
    mimeType: {
      allowNull: true,
      type: Sequelize.STRING
    },
    generalFieldValue: {
      allowNull: true,
      type: Sequelize.STRING(1024),
    },
    registerId: {
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'Register'
      },
      type: Sequelize.UUID
    },
    userId: {
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'User'
      },
      type: Sequelize.UUID
    },
    finishedAt: {
      allowNull: false,
      type: Sequelize.DATE(3),
    },
  });
  await queryInterface.addIndex('UserRegister', ['userId', 'registerId']);
}

