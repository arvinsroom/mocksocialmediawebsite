const { Sequelize } = require('sequelize');

export async function up({ context: queryInterface }) {
  await queryInterface.addColumn('UserPost', 'likedBy', {
    allowNull: true,
    type: Sequelize.STRING
  });
  await queryInterface.addColumn('UserPost', 'likedByOverflow', {
    allowNull: true,
    type: Sequelize.STRING
  });
  await queryInterface.addColumn('UserPost', 'retweetedBy', {
    allowNull: true,
    type: Sequelize.STRING
  });
  await queryInterface.addColumn('UserPost', 'retweetedByOverflow', {
    allowNull: true,
    type: Sequelize.STRING
  });
}

export async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('UserPost', 'likedBy');
  await queryInterface.removeColumn('UserPost', 'likedByOverflow');
  await queryInterface.removeColumn('UserPost', 'retweetedBy');
  await queryInterface.removeColumn('UserPost', 'retweetedByOverflow');
}
