'use strict';

const https = require('https');
const uri = 'http://map.simpleapi.net/stationapi';
const fetch = require('node-fetch');

let send = (data, callback) => {
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
let getNearestStation = async (x, y) => {
  let station = '';
  let path = uri + '?x=' + x + '&y=' + y + '&output=json';
  await fetch(path, {method: 'GET'})
  .then((res) => {
    return res.json();
  })
  .then((json) => {
    station = JSON.stringify(json);
  })
  .catch((err) => {
    console.log(err);
  });
  return station;
}

exports.main = async (event, _context, callback) => {
  let result = event.events && event.events[0];
  let station = '';
  let distance = '';
  let time = '';
  if (result) {
    let content = event.events[0] || {};
    let replyMessage = '';
    if(content.message.type !== 'location'){
      replyMessage = '位置情報を送って最寄駅を調べましょう'
    }else{
      let x = content.message.longitude;
      let y = content.message.latitude; 
      let stationData = await getNearestStation(x, y);
      stationData = JSON.parse(stationData);
      station = stationData[0].name;
      distance = stationData[0].distanceKm;
      time = stationData[0].traveltime;
      replyMessage = '最寄駅は、' + station + 'です。' + '距離は、' + distance + '、目安時間は、' + time + 'です。'
    }
    let message = {
      "replyToken":result.replyToken,
      "messages": [
        {
          "type": "text",
          "text": replyMessage
        }
      ]
    };
      send(message, () => {
      callback();
    });
    callback(null, {statusCode: 200, body: JSON.stringify({}), headers: {"header":"value"}, isBase64Encoded: false});
  } else {
    callback();
  }
};
