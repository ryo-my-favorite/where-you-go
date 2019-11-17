
const uri = 'http://map.simpleapi.net/stationapi';
const fetch = require('node-fetch');

exports.getNearestStation = async (x, y) => {
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
};