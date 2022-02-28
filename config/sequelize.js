const { Sequelize } = require('sequelize');
require('dotenv').config();
const {env} = process;

const sequelize = new Sequelize(env.DB_DATABASE, env.DB_USERNAME, env.DB_PASSWORD, {
    dialect: env.DB_DIALECT,
    host: env.DB_HOST,
    logging: env.DB_LOGGING,
    timezone: '+05:00'
});

module.exports = sequelize;
