const ACCESS_TOKEN = process.env.MERAKI_APIKEY;

exports.headers = { "X-Cisco-Meraki-API-Key": ACCESS_TOKEN };
exports.baseUrl = process.env.MERAKI_URL;
