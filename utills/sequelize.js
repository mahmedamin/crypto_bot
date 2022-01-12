const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('crypto_bot', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

module.exports = sequelize;
