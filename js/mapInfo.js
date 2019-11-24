
const fetch = require('node-fetch');

const API_URL = 'https://maps.googleapis.com/maps/api/directions/json?';
const API_KEY = process.env.GOOGLE_MAP_API_KEY;
const API_MODE = 'walking';
const MAP_INFO_URL = 'https://www.google.co.jp/maps/dir/';



exports.getMapURL = (from, to) => {
    return MAP_INFO_URL + from + '/' + to     
}
