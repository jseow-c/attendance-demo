const fetch = require("node-fetch");
const options = require("./options");
const misc = require("../misc");

const { fullOverwrite } = misc;

const overwrite = fullOverwrite("meraki.json");

const { baseUrl } = options;

const sleep = ms => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

exports.list = async (req, res, data) => {
  return res.json(data);
};

exports.update = async (req, res, setData) => {
  overwrite(req.body.data);
  setData(req.body.data);
  return res.json(req.body.data);
};

exports.snap = async (req, res, data) => {
  const { networkID, camSerial, apiKey } = data[req.params.camera_name];
  const headers = { "X-Cisco-Meraki-API-Key": apiKey };

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
