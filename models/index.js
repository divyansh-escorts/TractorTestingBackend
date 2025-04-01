"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const fetchSecrets = require("../middlewares/fetchSecrets");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const dotenv = require('dotenv');
dotenv.config();
// const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;

async function makeModels() {
  let config = process.env;
  
  sequelize = new Sequelize(
    config.URL_TTP
  );
  fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
      );
    })
    .forEach((file) => {
      const model = require(path.join(__dirname, file))(
        sequelize,
        Sequelize.DataTypes
        );
        db[model.name] = model;
      });
      
      Object.keys(db).forEach((modelName) => {
        if (db[modelName].associate) {
          db[modelName].associate(db);
        }
      });
      
      db.sequelize = sequelize;
      db.Sequelize = Sequelize;
      // console.log(sequelize);
  return db;
}

module.exports = makeModels;