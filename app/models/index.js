const dbConfig = require('../config/db.config');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    dbConfig.DB, 
    dbConfig.USER, 
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorAlias: false,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        },
    });
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// define all the models in the app
db.users = require('./user.model')(sequelize, Sequelize);
db.balances = require('./balance.model')(sequelize, Sequelize);
db.transactions = require('./transaction.model')(sequelize, Sequelize);

module.exports = db;