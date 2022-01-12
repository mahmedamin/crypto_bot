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

                if (bidDetails.next === lastBid?.stage)
                    return {error: "Please wait until next step"};

                // Condition to choose previous bid (if user hasn't apply for any bid before, it will consider previous bid from api service)
                const prevBidName = lastBid?.BidType?.name ||
                    bidTypes.find(d => d.name_alt === bidDetails.jieguo[0]).get('name');

                // TODO: last bid type and current bid type

                currentStepName = prevBidName === 'big' ? 'small' : prevBidName === 'small' ? 'big' : null;

                if (!currentStepName)
                    return {error: "Invalid step name"};

                const bidType = bidTypes.find(d => d.name === currentStepName),
                    lastBidWon = (lastBid?.name === prevBidName);
                console.log('lastBid?.name', lastBid?.name, 'prevBidName', prevBidName)

                if (lastBid) lastBid.update({win: lastBidWon});

                let nextStepNumber = 1;
                if (!lastBidWon) {
                    let nextStepNumber = lastBid?.step || 0;
                    nextStepNumber++;
                    if (nextStepNumber > 8)
                        nextStepNumber = 1;
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
                    bidType
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
