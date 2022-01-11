const fetch = require('node-fetch');

exports.getUserInfo = (auth_token) => {
    return fetch("https://www.91fp.cc/api/user/info", {
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
            "cookie": "_ga=GA1.2.901629022.1641217469; _gid=GA1.2.1542394067.1641217469; AWSALBTG=K0h2l+HgdCr5Jc4Ya1XWhbmIgkLzuJYJmZcsZUv0ma8xgkrOEyXyPn4nB3CpBff+UxHb9OkIFRitXX2XCbL7yEYWcEzjJB1Z+Ta8m067QJUF2fekFwVMepu1bdd6cmRcz3S1vdMVwMKYxM0GNwoIxWh4+bbZEqimND8zg6k7c8yYPUXzpag=; AWSALB=GpCxthHcnTY6JHdODCZUSH6JdWm5aZI/6fB8Z80P/TcuxMHVnuBgo7W1igwQssOscL7Q52EmS3+yIkDff5VN+z9RY5QmWMlSNLB4wsf9oBHuMoricOyfn6KGH9WT; bt_route=a0e7c984ec7d17cb513102d6e593bae7; angela_session=eyJpdiI6Ik1zT2tXQWlPdk0zUXFQdDhLcDFCZWc9PSIsInZhbHVlIjoiTGk3cmJjUU9KeGh0TkVoVlN1ejBvRjd3OVZLTlR5Q0xNT0pFWjhDRzFVWHl4Q3F2Q0hSY3dleHg4TnNuRW1ZUCIsIm1hYyI6ImQzNjczNGNlZGI2MGEzZWJiMjdjYWZmMzdlN2Y0NmRhN2FlYTUzZjFmNDA4MTY5ZDYzZDQ5OTc4YjA0YzM0ZTIifQ%3D%3D",
            "Referer": "https://www.91fp.cc/mobile/black/index.html",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
    }).then(r => r.json())
}

exports.getUserBalance = (response) => response?.message?.micro_wallet?.balance[0]?.change_balance;
