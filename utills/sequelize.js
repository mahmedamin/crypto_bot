const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('crypto_bot', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
