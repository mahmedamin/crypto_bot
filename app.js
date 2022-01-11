const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = require('./routes');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(router);


// app.get('/', (req, res) => {

    // Bid

    // fetch("https://www.91fp.cc/api/stagexz", {
    //     "headers": {
    //         "accept": "*/*",
    //         "accept-language": "en-US,en;q=0.9",
    //         "authorization": "b954e4f78e8ce071cf58e3bb9d0aff00",
    //         "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    //         "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"96\", \"Google Chrome\";v=\"96\"",
    //         "sec-ch-ua-mobile": "?0",
    //         "sec-ch-ua-platform": "\"macOS\"",
    //         "sec-fetch-dest": "empty",
    //         "sec-fetch-mode": "cors",
    //         "sec-fetch-site": "same-origin",
    //         "x-requested-with": "XMLHttpRequest",
    //         "cookie": "_ga=GA1.2.901629022.1641217469; _gid=GA1.2.1542394067.1641217469; AWSALB=GpCxthHcnTY6JHdODCZUSH6JdWm5aZI/6fB8Z80P/TcuxMHVnuBgo7W1igwQssOscL7Q52EmS3+yIkDff5VN+z9RY5QmWMlSNLB4wsf9oBHuMoricOyfn6KGH9WT; angela_session=eyJpdiI6IkkweWRCYkVXaFk2Q2VnRTFvdHhNbWc9PSIsInZhbHVlIjoibzhTSXhtaGZockc4dTR4eUFcL0lQSTVRM1BrMzY5eFVjZERSUXk1bnpDaFNBRHZWR1FXUFN0N0VvbWZPNGk4K1oiLCJtYWMiOiI0MjFhNTE2MDRkOWQ3ODcxMWE1ZGI0YWFiNGRkYjFhNGE4ZmYwNzg2NTI1NTMwNGZmMTcxMTFjN2YzZGJhNzYzIn0%3D; AWSALBTG=F/gdsvXfLkh2EB4QX4aPYD0ILTwkuGbw0Mg5wQ2bo5suue7ymq06gTVZY7rj9SnWlvjZ2sfKu1NjTND+RDbMAqwIhw2fyqHr536E3gzTyVFF/x2Tjn5cZ/hi5/wXZzPcjymWOgIdfy2XXX+0kOy1G2HeRtFvOOT4pQ5xAkqluKFyqJXVoHI=",
    //         "Referer": "https://www.91fp.cc/mobile/black/dataMap.html?tradeId=2&legal_id=3&currency_id=1&symbol=BTC/USDT",
    //         "Referrer-Policy": "strict-origin-when-cross-origin"
    //     },
    //     "body": "pan_id=2&wf_id=1&wf_name=大&xzmoney=0.001&stages=202201080120",
    //     "method": "POST"
    // }).then(r => r.json())
    //     .then(r => {
    //         console.log('r', r)
    //     }).catch(error => console.error('Error', error));



    // res.send('<h1>Done</h1>');
// });

app.use(router);

const port = process.env.PORT || 3000;
app.listen(port);
