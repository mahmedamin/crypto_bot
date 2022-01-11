const sequelize = require('../utills/sequelize'),
    fetch = require('node-fetch'),
    authService = require('../services/authService'),
    userService = require('../services/userService'),
    bidService = require('../services/bidService'),
    stepsService = require('../services/stepsService');

// Models
const User = require('../models/User'),
    BidType = require('../models/BidType'),
    Bid = require('../models/Bid');

let bidTypes = null;

exports.initiate = async (request, response, next) => {
    const userId = request.params.user;
    if (!userId)
        return response.status(403).send({error: "Access denied!"});
    try {
        const user = await User.findOne({
            attributes: ['id', 'email', 'plain_password', 'auth_token'],
            where: {
                id: userId,
                status: 1
            }
        }).catch(err => console.log('query error: ', err));

        if (!user)
            return response.status(403).send({error: "Access denied!"});

        const authResponse = await authService.validateAuth(user);

        if (!authResponse || !authResponse.success) {
            return response.status(403).send({error: authResponse?.message});
        }

        const authToken = authResponse.token;
        let balance = null;

        if (authResponse.balance)
            balance = parseFloat(authResponse.balance);
        else {
            await userService.getUserInfo(authToken)
                .then(response => {
                    balance = parseFloat(userService.getUserBalance(response));
                });
        }

        if (!balance)
            return response.status(406).send({error: "Balance not found!"});

        lastBid = null;

        try {
            if (!bidTypes) {
                bidTypes = await BidType.findAll();
            }

            lastBid = await Bid.findOne({
                include: BidType,
                where: {
                    user_id: userId,
                },
                order: [
                    ['id', 'DESC'],
                ]
            });
        } catch (err) {
            console.log('err', err)
            return response.status(406).send({error: err.message});
        }

        bidService.previousRecord()
            .then(r => {
                const bidDetails = r?.message?.list;
                if (!bidDetails)
                    return response.status(406).send({error: "Previous bid api response failure!"});

                // Condition to choose previous bid (if user hasn't apply for any bid before, it will consider previous bid from api service)
                const prevBidName = lastBid?.BidType?.name ||
                    bidTypes.find(d => d.name_alt === bidDetails.jieguo[0]).get('name');

                nextStepName = prevBidName === 'big' ? 'small' : prevBidName === 'small' ? 'big' : null;
                const nextBidAltName = bidTypes.find(d => d.name === nextStepName).get('name_alt');

                if (!nextStepName)
                    return response.status(406).send({error: "Invalid step name"});

                let nextStep = lastBid?.step || 0;
                nextStep++;
                if (nextStep > 8)
                    nextStep = 1;

                const stepAmount = stepsService.getStepAmount(nextStep, balance);

                if (bidDetails.next === lastBid?.stage)
                    return response.status(406).send({error: "Please wait until next step"});

                bidService.bidNow({authToken, nextStep: nextBidAltName, stepAmount, stage: bidDetails.next});

                console.log('nextStepName', nextStepName, 'nextBidAltName', nextBidAltName, 'nextStep', nextStep, 'stepAmount', stepAmount)
                console.log('bidDetails', bidDetails);

            }).catch(error => console.error('Error', error));
    } catch (err) {
        next(err);
    }

    response.send("initiated the transaction of ..");
};
