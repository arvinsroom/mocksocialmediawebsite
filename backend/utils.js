const environment = process.env.NODE_ENV;
const config = require(__dirname + '/config-' + environment.toString() + '.json');

export const databaseConfigurations = () => {
  if (!config.database) console.log('Please provide a database object');
  let db = {
    ...config.database
  };
  if (environment === 'development') {
    // This is when running frontend and backend locally in docker
    // then we want to connect our backend to listen to local sql instance
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

export const checkIfValidAndNotEmptyArray = (arr) => {
  return (arr && Array.isArray(arr) && arr.length > 0);
}

export const checkIfValidAndNotEmptyObj = (obj) => {
  return (obj && typeof obj === 'object' && (JSON.stringify(obj) !== '{}'));
}

export const isNumeric = (num) => {
  return !isNaN(num);
}

// this will shuffle the array in place
// make sure to give this a new array
export const shuffle = (array) => {
  let currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while ( 0 !== currentIndex ) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export const getNumberOrZero = (num) => {
  let integer = parseInt(num, 10);
  if (!isNaN(integer)) {
    return integer;
  }
  return 0;
}