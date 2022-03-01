const fetch = require('node-fetch'),
    Bid = require('../models/Bid'),
    stepsService = require('./stepsService'),
    constants = require('../config/constants');

exports.previousRecord = (auth_token) => {
    return fetch("https://www.81usdt.com/api/issue5min", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en",
            "content-type": "application/json",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "Referer": "https://www.81usdt.com/pages/trade/trade",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": "{}",
        "method": "POST"
    }).then(r => r.json());
}

exports.bidNow = async (params) => {
    const {step, user, bidType} = params;

    lastBidForStepOne = await Bid.findOne({
        attributes: ['id', 'initial_balance'],
        where: {
            user_id: user.id,
            step: 1
        },
        order: [
            ['id', 'DESC'],
        ]
    });


    let balanceForStep = step.stepNumber === 1 ? user.balance : (lastBidForStepOne?.initial_balance || user.balance);

    const stepAmount = stepsService.getStepAmount(step.stepNumber, balanceForStep);

    if (!stepAmount)
        return false;

    // ******************** TEMP ****************************
    // Bid.create({
    //     user_id: user.id,
    //     step: step.stepNumber,
    //     bid_type_id: bidType.id,
    //     amount: stepAmount,
    //     stage: step.stage,
    //     initial_balance: user.balance
    // }).catch(err => console.log('err', err));
    // return '';
    // ******************** TEMP ****************************

    await fetch("https://www.81usdt.com/api/auth/orders/addorder", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en",
            "access-token": user.accessToken,
            "auth": "true",
            "content-type": "application/json",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "token": user.authToken,
            "Referer": "https://www.81usdt.com/pages/trade/trade?type=1",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": `{"paypwd":"","issue":"${step.stage}","odds":${bidType.id},"rule":"${bidType.name_alt}","rate":1.95,"money":"${stepAmount}","isvir":"${constants.LIVE_MODE ? 0 : 1}"}`,
        "method": "POST"
    }).then(r => r.json())
        .then(response => {
            if (response.code === 1) {
                Bid.create({
                    user_id: user.id,
                    step: step.stepNumber,
                    bid_type_id: bidType.id,
                    amount: stepAmount,
                    stage: step.stage,
                    initial_balance: user.balance
                }).catch(err => console.log('err', err));
            }
        }).catch(error => console.error('Error', error));
}

exports.getOppositeBidName = (prevStepName) => prevStepName === 'big' ? 'small' : prevStepName === 'small' ? 'big' : null;
