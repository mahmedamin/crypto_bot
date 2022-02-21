const authService = require('../services/authService'),
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
            attributes: ['id', 'phone', 'plain_password', 'auth_token', 'access_token'],
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

        const authToken = authResponse.token,
            accessToken = authResponse.accessToken
        let balance = authResponse.balance;

        if (!authResponse.balance)
            await userService.getUserInfo(authToken, accessToken)
                .then(r => {
                    balance = userService.getUserBalance(r);
                });

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
                const bidDetails = r?.data?.prior_issue,
                    nextBidStage = r.data.cur_issue.issueno;
                if (!bidDetails || !r?.data?.cur_issue)
                    return {error: "Previous bid api response failure!"};

                if (nextBidStage === lastBid?.stage)
                    return {error: "Please wait until next step"};

                let lastBidTypeName = (bidDetails.rule.split(',')[0])?.toLowerCase();
                lastBidTypeName = lastBidTypeName === 'b' ? 'big' : lastBidTypeName === 's' ? 'small' : null;

                // Condition to choose previous bid (if user hasn't apply for any bid before, it will consider previous bid from api service)
                const prevStepName = lastBid?.BidType?.name || lastBidTypeName;

                currentStepName = prevStepName === 'big' ? 'small' : prevStepName === 'small' ? 'big' : null;

                if (!currentStepName)
                    return {error: "Invalid step name"};

                const currentBidType = bidTypes.find(d => d.name === currentStepName);

                let lastBidWon = null;
                if (lastBid) {
                    lastBidWon = (lastBid?.BidType?.name === lastBidTypeName);
                    Bid.update({
                        win: lastBidWon
                    }, {
                        where: {
                            user_id: userId,
                            stage: bidDetails.issueno,
                        }
                    });
                }

                let nextStepNumber = 1;
                if (!lastBidWon) {
                    nextStepNumber = lastBid?.step || 0;
                    nextStepNumber = parseInt(nextStepNumber) + 1;
                    if (nextStepNumber > 12) nextStepNumber = 1;
                }

                bidService.bidNow({
                    user: {
                        id: user.id,
                        authToken,
                        accessToken,
                        balance
                    },
                    step: {
                        stage: nextBidStage,
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
