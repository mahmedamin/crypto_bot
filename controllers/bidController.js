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
            attributes: ['id', 'phone', 'plain_password', 'auth_token', 'access_token', 'is_playing'],
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

        if (!balance)
            await userService.getUserInfo(authToken, accessToken)
                .then(r => {
                    balance = userService.getUserBalance(r);
                });

        if (!balance)
            return response.status(406).send({error: "Balance not found!"});

        let last2Bids = null,
            lastBid = null,
            secondLastBid = null;

        try {
            if (!bidTypes) {
                bidTypes = await BidType.findAll();
            }

            last2Bids = await Bid.findAll({
                include: BidType,
                where: {
                    user_id: userId,
                },
                order: [
                    ['id', 'DESC'],
                ],
                limit: 2
            });
        } catch (err) {
            console.log('err', err)
            return response.status(406).send({error: err.message});
        }

        if (last2Bids) {
            lastBid = last2Bids[0];
            secondLastBid = last2Bids[1];
        }

        await bidService.previousRecord()
            .then(r => {
                const bidDetails = r?.data?.prior_issue,
                    nextBidStage = r.data.cur_issue.issueno;
                if (!bidDetails || !r?.data?.cur_issue)
                    return {error: "Previous bid api response failure!"};

                console.log('-prev stage-', bidDetails.issueno, '-new stage-', nextBidStage);

                if (nextBidStage === lastBid?.stage)
                    return {error: "Please wait until next step"};

                if (lastBid?.stage && !lastBid.transaction_closed && (bidDetails.issueno !== lastBid?.stage)) {
                    // if (secondLastBid.win) {
                    //     bidDetails.issueno = lastBid.stage;
                    // } else {
                    return {error: "Previous step is missing"};
                    // }
                }

                let lastBidTypeName = (bidDetails.rule.split(',')[0])?.toLowerCase();
                lastBidTypeName = lastBidTypeName === 'b' ? 'big' : lastBidTypeName === 's' ? 'small' : null;

                // Condition to choose previous bid (if user hasn't apply for any bid before, it will consider previous bid from api service)
                const prevStepName = lastBid?.BidType?.name || lastBidTypeName;
                currentStepName = bidService.getOppositeBidName(prevStepName);

                if (lastBid && secondLastBid) {
                    if (secondLastBid.BidType.name === lastBid?.BidType?.name) {
                        currentStepName = bidService.getOppositeBidName(prevStepName);
                    } else {
                        currentStepName = prevStepName;
                    }
                }

                if (!currentStepName)
                    return {error: "Invalid step name"};

                const currentBidType = bidTypes.find(d => d.name === currentStepName);

                let lastBidWon = null;
                if (lastBid) {
                    lastBidWon = (lastBid?.BidType?.name === lastBidTypeName);

                    if (!lastBid.transaction_closed) {
                        Bid.update({
                            win: lastBidWon,
                            balance_after_result: balance
                        }, {
                            where: {
                                user_id: userId,
                                stage: bidDetails.issueno,
                            }
                        });
                    }
                }

                let nextStepNumber = 1;
                if (!lastBidWon) {
                    nextStepNumber = lastBid?.step || 0;
                    nextStepNumber = parseInt(nextStepNumber) + 1;
                    if (nextStepNumber > 9) {
                        return {error: "Lost! Cannot play further"};
                    }
                }

                if (1 === nextStepNumber && !user.is_playing)
                    return {error: "Not playing now"};

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
