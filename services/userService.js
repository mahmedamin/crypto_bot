const fetch = require('node-fetch'),
    constants = require('../config/constants');

exports.getUserInfo = (auth_token, access_token) => {
    return fetch("https://www.81usdt.com/api/auth/account/info", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en",
            "access-token": access_token,
            "auth": "true",
            "content-type": "application/json",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "token": auth_token,
            "Referer": "https://www.81usdt.com/pages/trade/trade?type=1",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": "{}",
        "method": "POST"
    }).then(r => r.json());
}

exports.getUserBalance = (response) => (constants.LIVE_MODE ? parseFloat(response?.data?.balance) : parseFloat(response?.data?.gift)) || undefined;
