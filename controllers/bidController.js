const sequelize = require('../utills/sequelize'),
    fetch = require('node-fetch'),
    authService = require('../services/authService'),
    userService = require('../services/userService'),
    bidService = require('../services/bidService');

// Models
const User = require('../models/User'),
    BidType = require('../models/BidType'),
    Bid = require('../models/Bid');

let bidTypes = null;

exports.initiate = async (request, response, next) => {
    const userId = request.params.user;
    let responseError = null;
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

        return console.log('authResponse',authResponse)

        if (!authResponse || !authResponse.success) {
            return response.status(403).send({error: authResponse?.message});
        }

        const authToken = authResponse.token;
        let balance = null;

        if (authResponse.balance)
            balance = parseFloat(authResponse.balance);
        else {
            await userService.getUserInfo(authToken)
                .then(r => {
                    balance = parseFloat(userService.getUserBalance(r));
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

        await bidService.previousRecord()
            .then(r => {
                const bidDetails = r?.message?.list;
                if (!bidDetails)
                    return {error: "Previous bid api response failure!"};

                // return console.log('lastBidType',bidTypes.find(d => d.name_alt === bidDetails.jieguo[0]).name)

                if (bidDetails.next === lastBid?.stage)
                    return {error: "Please wait until next step"};

                const lastBidType = bidTypes.find(d => d.name_alt === bidDetails.jieguo[0]); // Last bid type from API

                // Condition to choose previous bid (if user hasn't apply for any bid before, it will consider previous bid from api service)
                const prevStepName = lastBid?.BidType?.name || lastBidType.get('name');

                currentStepName = prevStepName === 'big' ? 'small' : prevStepName === 'small' ? 'big' : null;

                if (!currentStepName)
                    return {error: "Invalid step name"};

                const currentBidType = bidTypes.find(d => d.name === currentStepName);

                const lastBidWon = (lastBid.BidType?.name === lastBidType.get('name'));

                Bid.update({
                    win: lastBidWon
                },{
                    where: {
                        user_id: userId,
                        stage: bidDetails.prevstage,
                    }
                });

                let nextStepNumber = 1;
                if (!lastBidWon) {
                    nextStepNumber = lastBid?.step || 0;
                    nextStepNumber = parseInt(nextStepNumber) + 1;
                    if (nextStepNumber > 8) nextStepNumber = 1;
                }

                bidService.bidNow({
                    user: {
                        id: user.id,
                        authToken,
                        balance
                    },
                    step: {
                        stage: bidDetails.next,
                        stepNumber: nextStepNumber,
                    },
                    bidType: currentBidType
                });
            })
            .then(r => {
                if (r && r.error)
                    responseError = r;
            })
            .catch(error => console.error('Error', error));


    } catch (err) {
        next(err);
    }

    if (responseError)
        return response.status(406).send(responseError);

    response.send("initiated the transaction of ..");
};
