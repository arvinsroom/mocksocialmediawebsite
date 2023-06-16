import { Umzug, SequelizeStorage } from 'umzug';
import db from './clients/database-client';
const path = require("path");

const umzug = new Umzug({
  storage: new SequelizeStorage({ sequelize: db.sequelize }),
  migrations: {
      glob: path.resolve(__dirname, './migrations') + '/*.js',
  },
  context: db.sequelize.getQueryInterface(),
  // We currently do not make use of the logging feature; therefore switching it off
  // Accepted values: console
  logger: undefined,
});

export const umzugUp = async () => await umzug.up();

// make sure to remove this command before production,
// we donot want to have some access to drop everything
// Following can be umcommented and ran to drop all tables manually
// export const umzugDown = async () => await umzug.down({ to: 0 });