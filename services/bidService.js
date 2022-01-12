const fetch = require('node-fetch'),
    Bid = require('../models/Bid'),
    stepsService = require('./stepsService');

exports.previousRecord = (auth_token) => {
    return fetch("https://www.91fp.cc/api/stageprev?pan_id=2", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "authorization": auth_token,
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"96\", \"Google Chrome\";v=\"96\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest",
            "cookie": "_ga=GA1.2.901629022.1641217469; _gid=GA1.2.1542394067.1641217469; AWSALB=GpCxthHcnTY6JHdODCZUSH6JdWm5aZI/6fB8Z80P/TcuxMHVnuBgo7W1igwQssOscL7Q52EmS3+yIkDff5VN+z9RY5QmWMlSNLB4wsf9oBHuMoricOyfn6KGH9WT; AWSALBTG=INkIv+UAOsqxT5j/BCeABLNML08/INXGs8r6GDLaOc0qKKDlil/mUPuS/zw6dWnoszT0vlRpwuA1eIIwB+Hp9/6zf4aTHrfrGzVj/hOzjYJ75W8mSS0nqBPcgGKrL3jzACjGD5lV9Ej4PtYGDdICEmx2xmTVB49uSpznoc0NZvJZ5CSN/YQ=; angela_session=eyJpdiI6InBESElNbWFXWEtNNktDbmVmRkFneUE9PSIsInZhbHVlIjoidDVPXC9yMHNZZnZuUE53Q1BpRFFUMFdcL2M3NXJIQXlGNmlkZ0F6a1pnNEdPcGY5WDIrWGR3Nm1IRUxrVjdTVUJuIiwibWFjIjoiZDNjZWMzNTllNWI1ZmFkNDI5ZGFjNWQ4MzhiMGRhM2YwYzc1Yzg4YzJhMjUyMjhmZjllMjc5MzQxMTliODEyMiJ9; cf_ob_info=502:6ca1535cfcc97aa4:MCT; cf_use_ob=0",
            "Referer": "https://www.91fp.cc/mobile/black/dataMap.html?tradeId=2&legal_id=3&currency_id=1&symbol=BTC/USDT",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
    }).then(r => r.json())
}

exports.bidNow = async (params) => {
    const {step, user, bidType} = params;
    const stepAmount = stepsService.getStepAmount(step.stepNumber, user.balance);

    if (!stepAmount)
        return false;

    console.log('--o',
        'user.authToken', user.authToken,
        'stepAmount',stepAmount,
    );

    // ******************** TEMP ****************************
    Bid.create({
        user_id: user.id,
        step: step.stepNumber,
        bid_type_id: bidType.id,
        amount: stepAmount,
        stage: step.stage,
        currentBalance: user.balance
    }).catch(err => console.log('err', err));
    return '';
    // ******************** TEMP ****************************

    await fetch("https://www.91fp.cc/api/stagexz", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "authorization": user.authToken,
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"96\", \"Google Chrome\";v=\"96\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest",
            "cookie": "_ga=GA1.2.901629022.1641217469; _gid=GA1.2.1542394067.1641217469; AWSALB=GpCxthHcnTY6JHdODCZUSH6JdWm5aZI/6fB8Z80P/TcuxMHVnuBgo7W1igwQssOscL7Q52EmS3+yIkDff5VN+z9RY5QmWMlSNLB4wsf9oBHuMoricOyfn6KGH9WT; angela_session=eyJpdiI6IkkweWRCYkVXaFk2Q2VnRTFvdHhNbWc9PSIsInZhbHVlIjoibzhTSXhtaGZockc4dTR4eUFcL0lQSTVRM1BrMzY5eFVjZERSUXk1bnpDaFNBRHZWR1FXUFN0N0VvbWZPNGk4K1oiLCJtYWMiOiI0MjFhNTE2MDRkOWQ3ODcxMWE1ZGI0YWFiNGRkYjFhNGE4ZmYwNzg2NTI1NTMwNGZmMTcxMTFjN2YzZGJhNzYzIn0%3D; AWSALBTG=F/gdsvXfLkh2EB4QX4aPYD0ILTwkuGbw0Mg5wQ2bo5suue7ymq06gTVZY7rj9SnWlvjZ2sfKu1NjTND+RDbMAqwIhw2fyqHr536E3gzTyVFF/x2Tjn5cZ/hi5/wXZzPcjymWOgIdfy2XXX+0kOy1G2HeRtFvOOT4pQ5xAkqluKFyqJXVoHI=",
            "Referer": `https://www.91fp.cc/mobile/black/dataMap.html?tradeId=2&legal_id=3&currency_id=1&symbol=BTC/USDT`,
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": `pan_id=2&wf_id=1&wf_name=${bidType.name_alt}&xzmoney=${stepAmount}&stages=${step.stage}`,
        "method": "POST"
    }).then(r => r.json())
        .then(response => {
            if (response.type === 'ok') {
                Bid.create({
                    user_id: user.id,
                    step: step.stepNumber,
                    bid_type_id: bidType.id,
                    amount: stepAmount,
                    stage: step.stage,
                    currentBalance: user.balance
                }).catch(err => console.log('err', err));
            }
        }).catch(error => console.error('Error', error));
}
