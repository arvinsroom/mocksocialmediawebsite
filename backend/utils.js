const environment = process.env.NODE_ENV;
const config = require(__dirname + '/config-' + environment.toString() + '.json');

export const databaseConfigurations = () => {
  if (!config.database) console.log('Please provide a database object');
  let db = {
    ...config.database
  };
  if (environment === 'development') {
    if (process.env.MYSQL_HOST) return { ...db, host: process.env.MYSQL_HOST }
  }
  return db;
}

export const adminCredConfigurations = () => {
  if (config.adminCredentials) return config.adminCredentials;
  else console.log('Please provide a database object!')
}

export const secretConfigurations = () => {
  if (config.secret) return config.secret;
  else console.log('Please provide a Secret!')
}