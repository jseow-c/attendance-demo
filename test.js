var mqtt = require("mqtt");
var client = mqtt.connect(
  "mqtt://ec2-18-140-56-255.ap-southeast-1.compute.amazonaws.com"
);

client.on("connect", function() {
  client.subscribe("/merakimv/Q2GV-KXJP-QPLN/raw_detections", function(err) {
    console.log("subscribed");
  });
});

client.on("/merakimv/Q2GV-KXJP-QPLN/raw_detections", function(topic, message) {
  // message is Buffer
  console.log("got an image");
  client.end();
});
