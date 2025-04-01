const { Sequelize} = require('sequelize');
const fetchSecrets = require('./fetchSecrets');
const dotenv = require('dotenv');
dotenv.config();
let sequelize;
async function checkConnection() {
    try {
        let secrets = process.env;
        sequelize = new Sequelize(secrets.URL_FDC);
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}

checkConnection()
module.exports=sequelize