const {Model, DataTypes} = require('sequelize');
const sequelize = require('../utills/sequelize')

class BidType extends Model {
}

BidType.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: DataTypes.STRING,
    name_alt: DataTypes.STRING,
}, {
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'bid_types'
});

module.exports = BidType;
