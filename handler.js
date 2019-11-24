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
    let replyMessage = [
      {
        'type': 'text',
        'text': ''
      }
    ];
    if(content.message.type === 'text'){//Text Message
      if(content.message.text.indexOf('開く') !== -1 ){
        let x = locationState.location.x;
        let y = locationState.location.y;
        let from = `${y},${x}`;
        let to = locationState.distination.station;
        let url = mapInfo.getMapURL(from, to);

        console.log(url);
        replyMessage[0].text = url;
      }else if(content.message.text.indexOf('開かない') !== -1 ){
        replyMessage[0].text = 'かしこまりました。'
      }else{
        replyMessage[0].text = '位置情報を送って最寄駅を調べましょう';
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

      //container may be same
      locationState.location.x = x;
      locationState.location.y = y;
      locationState.distination.station = station;

      replyMessage[0].text = `最寄駅は、${station}です。距離は、${distance} で、${time}かかる見込みです。`;
      let nextMessage = lineApiUtils.getTemplateMessageTemplate(`${station}までの地図を開きますか？`, '開く', '開かない');
      
      replyMessage.push(nextMessage);
    }else{
      console.log('Error == No setting this type message ==')
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
