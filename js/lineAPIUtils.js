
const https = require('https');

/**
 * @param data send Message
 * @param any callback func
 */
exports.pushMessage = (data, callback) => {
    let body = JSON.stringify(data);

    let req = https.request({
        hostname: "api.line.me",
        port: 443,
        path: "/v2/bot/message/reply",
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
        "Authorization": "Bearer " + process.env.CHANNEL_ACCESS_TOKEN
        }
    });

    req.end(body, (err) => {
        err && console.log(err);
        callback(err);
    });
}