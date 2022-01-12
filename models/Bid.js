const {Model, DataTypes} = require('sequelize'),
    sequelize = require('../utills/sequelize'),
    BidType = require('./BidType');

class Bid extends Model {
}

Bid.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: DataTypes.INTEGER,
    step: DataTypes.INTEGER,
    bid_type_id: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL(10, 2),
    stage: DataTypes.INTEGER,
    win: DataTypes.BOOLEAN,
}, {
    sequelize,
    timestamps: true,
    createdAt: 'bid_at',
    updatedAt: false,
    tableName: 'bids'
});

Bid.belongsTo(BidType, {
    foreignKey: 'bid_type_id',
});

module.exports = Bid;
