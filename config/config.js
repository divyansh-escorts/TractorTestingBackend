const fetchSecrets = require('../middlewares/fetchSecrets');
const dotenv = require('dotenv');
dotenv.config();
async function fetchCredentials() {
  let secrets = process.env;
  return {
    development: {
      username: secrets.DB_USER,
      password: secrets.DB_PASSWORD,
      database: secrets.DATABASE_TTP,
      host: secrets.DB_HOST,
      dialect: 'postgres',
    },
    test: {
      username: secrets.DB_USER,
      password: secrets.DB_PASSWORD,
      database: secrets.DATABASE_TTP,
      host: secrets.DB_HOST,
      dialect: 'postgres',
    },
    production: {
      username: secrets.DB_USER,
      password: secrets.DB_PASSWORD,
      database: secrets.DATABASE_TTP,
      port: secrets.DB_PORT,
      dialect: 'postgres',
    }
  }
}

module.exports = fetchCredentials();