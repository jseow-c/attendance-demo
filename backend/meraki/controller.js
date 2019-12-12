const fetch = require("node-fetch");
const options = require("./options");

const { baseUrl, headers } = options;

const sleep = ms => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

exports.snap = async (req, res) => {
  const networkID = process.env.MERAKI_NETWORKID;
  const camSerial = process.env.MERAKI_CAMSERIAL;

  const url = `${baseUrl}/networks/${networkID}/cameras/${camSerial}/snapshot`;
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers
  });
  const responseJson = await response.json();

  // ensure photo is created by meraki
  for (let i = 0; i < 30; i++) {
    const ensurePhoto = await fetch(responseJson.url);
    if (ensurePhoto.status !== 404) break;
    await sleep(500);
  }
  return res.send(responseJson.url);
};
