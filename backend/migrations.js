import Umzug from 'umzug';
import db from './clients/database-client';

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
      path: 'migrations',
      pattern: /\.js$/
  },
  logger: console // Change this later
});

export const umzugUp = async () => await umzug.up();

// make sure to remove this command before production,
// we donot want to have some access to drop everything
export const umzugDown = async () => await umzug.down({ to: 0 });