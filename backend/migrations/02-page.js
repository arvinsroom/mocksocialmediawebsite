const { Sequelize } = require('sequelize');

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable('Page');
}

export async function up({ context: queryInterface }) {
  await queryInterface.createTable('Page', {
    _id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID
    },
    name: {
      allowNull: false,
      type: Sequelize.STRING
    },
    templateId: {
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        key: '_id',
        model: 'Template'
      },
      type: Sequelize.UUID
    },
    pageDataOrder: {
      allowNull: true,
      type: Sequelize.ENUM('DESC', 'ASC', 'RANDOM')
    },
    type: {
      allowNull: false,
      type: Sequelize.ENUM('MCQ', 'OPENTEXT', 'INFO', 'REGISTER', 'FINISH', 'FACEBOOK', 'REDDIT', 'TWITTER', 'INSTAGRAM',
      'YOUTUBE', 'SLACK', 'TIKTOK')
    },
    flowOrder: {
      allowNull: false,
      type: Sequelize.SMALLINT
    },
    richText: {
      allowNull: true,
      type: Sequelize.TEXT
    },
    appearTime: {
      allowNull: false,
      type: Sequelize.SMALLINT
    }
  });
  await queryInterface.addIndex('Page', ['templateId', 'type']);
}

