const fs = require("fs");
const mqtt = require("mqtt");
const fetch = require("node-fetch");
const options = require("./options");
const misc = require("../misc");

const { fullOverwrite } = misc;

const overwrite = fullOverwrite("meraki.json");

const { baseUrl } = options;

/**
 * Sleeps for x amount of seconds for async/await functions
 * @param {number} ms number of milliseconds to sleep
 */
const sleep = ms => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

/**
 * List all stored meraki data in meraki.json
 * @return {json} {setting1: {networkID, apiKey, camSerial, mqttSense}, setting2: {}, ...}
 */
exports.list = async (req, res, data) => {
  return res.json(data);
};

/**
 * Update stored meraki data in meraki.json by doing a full overwrite
 * @return {json} {setting1: {networkID, apiKey, camSerial, mqttSense}, setting2: {}, ...}
 */
exports.update = async (req, res, setData) => {
  overwrite(req.body.data);
  setData(req.body.data);
  return res.json(req.body.data);
};

/**
 * Take a snapshot using given meraki settings
 * @param {string} req.params.camera_name setting name of the camera to be used
 * @return {base64 string} image taken using meraki
 */
exports.snap = async (req, res, data) => {
  const { networkID, camSerial, apiKey } = data[req.params.camera_name];
  const timestamp = req.body.timestamp;
  const headers = { "X-Cisco-Meraki-API-Key": apiKey };

  // call api to do the snapshot
  // returns an url where the image resides
  const url = `${baseUrl}/networks/${networkID}/cameras/${camSerial}/snapshot`;
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    body: JSON.stringify({ timestamp }),
    headers
  });
  const responseJson = await response.json();

  // ensure photo is created by meraki - sleep every 500ms until url is accessible
  // return the image upon testing accessible url
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

/**
 * MV Sense using given meraki settings by proceeding into MQTT
 * @param {string} req.body.mqtt mqtt topic to listen to
 * @return {boolean} returns true if people is detected else false
 */
exports.mqtt_check = async (req, res) => {
  const mqttSense = req.body.mqtt;

  // start logger
  const logger = fs.createWriteStream("mqtt.log", { flags: "a" });
  logger.write(`[${new Date().toISOString()}] MV Sense Initiated\n`);

  // connect to mqtt server and subscribe to mqtt settings
  const client = mqtt.connect(`mqtt://${process.env.MQTT_SERVER}`);
  client.on("connect", function() {
    client.subscribe(mqttSense, function(err) {
      logger.write(`[${new Date().toISOString()}] MQTT Subscribed\n`);
      console.log("subscribed");
    });
  });

  // failsafe timeout function to ensure
  // api call ends in 10 seconds
  const timeoutFunction = setTimeout(() => {
    logger.write(`[${new Date().toISOString()}] MV Sense Ended\n`);
    logger.end();
    client.end();
    res.json({ check: false, timestamp: null });
  }, 10000);

  // listens to the topic and check if human can be detected
  client.on("message", async (topic, message) => {
    if (topic === mqttSense) {
      logger.write(
        `[${new Date().toISOString()}] Message: ${message.toString("ascii")}\n`
      );

      const msgBuffer = JSON.parse(message.toString("ascii"));
      let peopleDetected = 0;

      // counts - found in zones
      // objects - found in raw_detection/entire_image
      if (Object.keys(msgBuffer).includes("counts")) {
        peopleDetected = msgBuffer.counts.person > 0;
      } else if (Object.keys(msgBuffer).includes("objects")) {
        peopleDetected =
          msgBuffer.objects.filter(i => i.type === "person").length > 0;
      }

      // clean-up procedure
      if (peopleDetected) {
        clearTimeout(timeoutFunction);
        client.unsubscribe(mqttSense);
        logger.end();
        client.end();
        res.json({
          check: true,
          timestamp: new Date(msgBuffer.ts).toISOString()
        });
      }
    }
  });
};
