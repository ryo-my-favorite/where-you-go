
const https = require('https');
const json = require('../json/messageObject');

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
/**
 * @param text textMessage
 */
exports.getTextMessageTemplate = (text) => {
    let textMessage = {
        'type': 'text',
        'text': text
    }
    return textMessage;
}

/**
 * @param text textMessage
 * @param label1 button's label like 'Yes'
 * @param label2 button's label like 'No'
 */
exports.getTemplateMessageTemplate = (text, label1, label2) => {
    let templateMessage = {
        'type': 'template',
        'altText': text,
        'template': {
          'type': 'confirm',
          'text': text,
          'actions': [
            {
              'type': 'message',
              'label': label1,
              'text': label1
            },
            {
              'type': 'message',
              'label': label2,
              'text': label2
            }
          ]
        }
      };
    
    return templateMessage;
}

exports.getLocationMessageTemplate = () => {
    
}