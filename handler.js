'use strict';

const Message = require('./js/message');
const lineApiUtils = require('./js/lineAPIUtils');
const mapInfo = require('./js/mapInfo');
let locationState = require('./json/location')


exports.main = async (event, _context, callback) => {
  let result = event.events && event.events[0];
  let station = '';
  let distance = '';
  let time = '';
  if (result) {
    let content = event.events[0] || {};
    let replyMessage = [];

    if(content.message.type === 'text'){//Text Message
      if(content.message.text.indexOf('開く') !== -1 ){
        let x = locationState.location.x;
        let y = locationState.location.y;
        
        let from = `${y},${x}`;
        let to = locationState.distination.station;
        let url = mapInfo.getMapURL(from, to);

        replyMessage.push(lineApiUtils.getTextMessageTemplate(url));
      }else if(content.message.text.indexOf('開かない') !== -1 ){
        replyMessage.push(lineApiUtils.getTextMessageTemplate('かしこまりました。'));
      }else{
        replyMessage.push(lineApiUtils.getTextMessageTemplate('位置情報を送って最寄駅を調べましょう'));
        replyMessage.push(lineApiUtils.getTextMessageTemplate('下の+ボタンから位置情報を送信できます。'));
      }

    }else if(content.message.type === 'location'){// Location Message
      let x = content.message.longitude;
      let y = content.message.latitude;
      
      let stationData = await Message.getNearestStation(x, y);

      stationData = JSON.parse(stationData);
      station = stationData[0].name;
      distance = stationData[0].distanceKm;
      time = stationData[0].traveltime;

      //Same container is used
      locationState.location.x = x;
      locationState.location.y = y;
      locationState.distination.station = station;

      let resultMessage = `最寄駅は、${station}です。距離は、${distance} で、${time}かかる見込みです。`;
      let nextMessage = `${station}までの地図を開きますか？`;

      let resultMessageTemplate = lineApiUtils.getTextMessageTemplate(resultMessage);
      let nextMessageTemplate = lineApiUtils.getTemplateMessageTemplate(nextMessage, '開く', '開かない');
      
      replyMessage.push(resultMessageTemplate)
      replyMessage.push(nextMessageTemplate);
    }else{
      console.log('== No setting for this type message ==')
    }

   console.log(replyMessage);
    let message = {
      'replyToken':result.replyToken,
      'messages': replyMessage
    };

    lineApiUtils.pushMessage(message, () => {
      callback();
    });

    callback(null, {statusCode: 200, body: JSON.stringify({}), headers: {"header":"value"}, isBase64Encoded: false});
  } else {
    callback();
  }
};
