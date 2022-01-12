const sequelize = require('../utills/sequelize'),
    fetch = require('node-fetch'),
    userService = require('./userService');

exports.validateAuth = async (user) => {
    let output = null;
    let authToken = user.get('auth_token');
    await userService.getUserInfo(authToken)
        .then(response => {
            if (response.type !== 'ok') {
                return login(user)
            }

            console.warn('Already logged in')
            return {
                success: true,
                message: 'Already authenticated',
                token: authToken,
                balance: userService.getUserBalance(response)
            };
        }).then(response => {
            if (response?.success)
                output = response;
            else {
                // Login response
                console.warn('login successful')
                if (response.type !== 'ok') {
                    output = {
                        success: false,
                        message: 'Unable to authenticate'
                    }
                } else {
                    authToken = response.message;

                    user.update({auth_token: authToken});

                    output = {
                        success: true,
                        message: 'Authenticated',
                        token: authToken
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
    return fetch("https://www.91fp.cc/api/user/login", {
        "headers": {
            "accept": "*/*",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"96\", \"Google Chrome\";v=\"96\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "x-requested-with": "XMLHttpRequest",
            "Referer": "https://www.91fp.cc/mobile/black/login.html",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": `user_string=${user.get('email')}&password=${user.get('plain_password')}`,
        "method": "POST"
    }).then(r => r.json())
}
