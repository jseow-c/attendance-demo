const ACCESS_TOKEN = process.env.INTERCORP_KEY;

exports.headers = { "X-API-Key": ACCESS_TOKEN };
exports.baseUrl = process.env.INTERCORP_URL;
