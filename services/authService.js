const sequelize = require('../config/sequelize'),
    fetch = require('node-fetch'),
    userService = require('./userService');

exports.validateAuth = async (user) => {
    let output = null;
    let authToken = user.get('auth_token');
    let accessToken = user.get('access_token');

    await userService.getUserInfo(authToken, accessToken)
        .then(response => {
            if (response.code !== 1) {
                return login(user)
            }

            console.warn('Already logged in')
            return {
                success: true,
                message: 'Already authenticated',
                token: authToken,
                accessToken,
                balance: userService.getUserBalance(response)
            };
        }).then(response => {
            if (response?.success)
                output = response; // Already logged in response
            else {
                // Login response
                console.warn('login successful')
                if (response.code !== 1) {
                    output = {
                        success: false,
                        message: 'Unable to authenticate'
                    }
                } else {
                    authToken = response.data.token;
                    accessToken = response.data.access_token;

                    user.update({auth_token: authToken, access_token: accessToken});

                    output = {
                        success: true,
                        message: 'Authenticated',
                        token: authToken,
                        accessToken
                    }
                }
            }
        })
        .catch(err => {
            console.log('err', err)
            output = {
                success: false,
                message: err.message
            }
        });

    return output;
};

const login = (user) => {
    return fetch("https://www.81usdt.com/api/login", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en",
            "content-type": "application/json",
            "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"97\", \"Chromium\";v=\"97\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "Referer": "https://www.81usdt.com/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": `{"phone":"${user.get('phone')}","password":"${user.get('plain_password')}"}`,
        "method": "POST"
    }).then(r => r.json());
}
