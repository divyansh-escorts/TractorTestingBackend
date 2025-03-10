const { Sequelize} = require('sequelize');
const fetchSecrets = require('./fetchSecrets');

let sequelize;
async function checkConnection() {
    try {
        let secrets = await fetchSecrets()
        sequelize = new Sequelize(secrets.URL_FDC);
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}

checkConnection()
module.exports=sequelize