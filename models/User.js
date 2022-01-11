const {Model, DataTypes} = require('sequelize');
const sequelize = require('../utills/sequelize')

class User extends Model {
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: DataTypes.STRING,
    plain_password: DataTypes.STRING,
    auth_token: DataTypes.STRING,
    status: DataTypes.BOOLEAN
}, {
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'users'
});

module.exports = User;
