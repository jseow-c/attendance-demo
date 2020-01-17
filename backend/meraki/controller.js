const mqtt = require("mqtt");
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

exports.mqtt_check = async (req, res) => {
  // mqttSense is the topic to listen to
  const mqttSense = req.body.mqtt;
  // connect to mqtt server and subscribe to mqtt settings
  const client = mqtt.connect(`mqtt://${process.env.MQTT_SERVER}`);
  client.on("connect", function() {
    client.subscribe(mqttSense, function(err) {
      console.log("subscribed");
    });
  });
  const timeoutFunction = setTimeout(() => {
    client.end();
    res.json({ check: false });
  }, 10000);
  client.on("message", async (topic, message) => {
    if (topic === mqttSense) {
      const msgBuffer = JSON.parse(message.toString("ascii"));
      let peopleDetected = 0;
      if (Object.keys(msgBuffer).includes("counts")) {
        peopleDetected = msgBuffer.counts.person > 0;
      } else if (Object.keys(msgBuffer).includes("objects")) {
        peopleDetected =
          msgBuffer.objects.filter(i => i.type === "person").length > 0;
      }
      if (peopleDetected) {
        clearTimeout(timeoutFunction);
        client.unsubscribe(mqttSense);
        client.end();
        res.json({ check: true });
      }
    }
  });
};
