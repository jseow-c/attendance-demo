const fetch = require("node-fetch");
const options = require("./options");

const { baseUrl } = options;

const sleep = ms => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

const getCameraDetails = () => {
  const networkID = process.env.MERAKI_NETWORK_ID;
  const camSerial = process.env.MERAKI_CAMERA_SERIAL;
  const ACCESS_TOKEN = process.env.MERAKI_API_KEY;
  return { networkID, camSerial, ACCESS_TOKEN };
};

exports.snap = async (req, res) => {
  const { networkID, camSerial, ACCESS_TOKEN } = getCameraDetails();
  const headers = { "X-Cisco-Meraki-API-Key": ACCESS_TOKEN };

  const url = `${baseUrl}/networks/${networkID}/cameras/${camSerial}/snapshot`;
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers
  });
  const responseJson = await response.json();

  // ensure photo is created by meraki
  let image;
  for (let i = 0; i < 30; i++) {
    const ensurePhoto = await fetch(responseJson.url);
    if (ensurePhoto.status !== 404) {
      image = await ensurePhoto.buffer();
      image = `data:image/jpg;base64,${image.toString("base64")}`;
      break;
    }
    await sleep(500);
  }
  return res.json({ image });
};
