const fetch = require('node-fetch');

exports.getUserInfo = (auth_token, access_token) => {
    return fetch("https://www.81usdt.com/api/auth/member/info", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en",
            "access-token": access_token,
            "auth": "true",
            "content-type": "application/json",
            "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"97\", \"Chromium\";v=\"97\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "token": auth_token,
            "Referer": "https://www.81usdt.com/pages/user/index",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": "{}",
        "method": "POST"
    }).then(r => r.json());
}

exports.getUserBalance = (response) => parseFloat(response?.data?.balance) || undefined;
