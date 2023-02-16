const { Sequelize } = require('sequelize');

export async function up({ context: queryInterface }) {
  await queryInterface.addColumn('UserPost', 'warningLabel', {
    allowNull: true,
    type: Sequelize.ENUM('FOOTNOTE', 'OVERPOSTNOTE', 'NONE'),
    defaultValue: null
  });
  await queryInterface.addColumn('UserPost', 'labelRichText', {
    allowNull: true,
    type: Sequelize.TEXT,
    defaultValue: null,
  });
  await queryInterface.addColumn('UserPost', 'checkersLink', {
    allowNull: true,
    type: Sequelize.STRING(1024),
    defaultValue: null,
  });
}

export async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('UserPost', 'warningLabel');
  await queryInterface.removeColumn('UserPost', 'labelRichText');
  await queryInterface.removeColumn('UserPost', 'checkersLink');
}
