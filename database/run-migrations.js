#!/usr/bin/env node
const Umzug = require('umzug');
const db = require('./clients/database-client');

const umzug = new Umzug({
  storage: 'sequelize',
  storageOptions: {
      sequelize: db.sequelize
  },
  migrations: {
      params: [
        db.sequelize.getQueryInterface(),
        db.Sequelize
      ],
      path: __dirname + '/db/migrations',
      pattern: /\.js$/
  },
  logger: console // Change this later
});

(async () => {
  await umzug.up();
  console.log('Migrations ran successfully!');
  return;
})();
