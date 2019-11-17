'use strict';

const Message = require('./js/message');
const lineApiUtils = require('./js/lineAPIUtils');


exports.main = async (event, _context, callback) => {
  let result = event.events && event.events[0];
  let station = '';
  let distance = '';
  let time = '';
  if (result) {
    let content = event.events[0] || {};
    let textMessage = '';
    if(content.message.type !== 'location'){
      textMessage = '位置情報を送って最寄駅を調べましょう'
    }else{
      let x = content.message.longitude;
      let y = content.message.latitude; 
      let stationData = await Message.getNearestStation(x, y);
      stationData = JSON.parse(stationData);
      station = stationData[0].name;
      distance = stationData[0].distanceKm;
      time = stationData[0].traveltime;
      textMessage = `最寄駅は、${station}です。距離は、${distance} で、${time}かかる見込みです。`;
    }
    let simpleMessage = [
      {
        "type": "text",
        "text": textMessage
      }
    ]
    let message = {
      "replyToken":result.replyToken,
      "messages": simpleMessage
    };
      lineApiUtils.pushMessage(message, () => {
      callback();
    });
    callback(null, {statusCode: 200, body: JSON.stringify({}), headers: {"header":"value"}, isBase64Encoded: false});
  } else {
    callback();
  }
};
