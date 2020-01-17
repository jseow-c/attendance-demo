const axios = require("axios");
const sharp = require("sharp");
const HttpsProxyAgent = require("https-proxy-agent");
const options = require("../options");

const { baseUrl, headers } = options;

const IntercorpOptions = { headers };
if (process.env.PROXY) {
  IntercorpOptions.proxy = false;
  IntercorpOptions.httpsAgent = new HttpsProxyAgent(process.env.PROXY);
}

exports.list = async (req, res) => {
  const collection_id = req.params.collection_id;
  const url = `${baseUrl}/persons/${collection_id}`;
  const persons = await axios.get(url, IntercorpOptions);
  return res.json(persons.data.response);
};

const resizeBase64 = async base64Image => {
  let parts = base64Image.split(";");
  let imageData = parts[1].split(",")[1];

  var buffer = new Buffer.from(imageData, "base64");
  const resizedBuffer = await sharp(buffer)
    .jpeg({ quality: 60 })
    // .resize({ width: 350 })
    .toBuffer();
  return resizedBuffer.toString("base64");
};

exports.create = async (req, res) => {
  const collection_id = req.params.collection_id;
  const person_name = req.body.name;
  const image = req.body.image;
  const person_id = `${person_name.replace(/\s+/g, "")}Id`;

  const url = `${baseUrl}/enrollment`;
  const images = await Promise.all([resizeBase64(image)]);
  const postData = { images, person_name, person_id, collection_id };
  await axios.post(url, postData, IntercorpOptions);

  const personUrl = `${baseUrl}/person/${collection_id}/${person_id}`;
  const response = await axios.get(personUrl, IntercorpOptions);

  return res.json(response.data.response);
};

exports.delete = async (req, res) => {
  const collection_id = req.params.collection_id;
  const person_id = req.params.person_id;

  const url = `${baseUrl}/person/${collection_id}/${person_id}`;
  await axios.delete(url, IntercorpOptions);
  return res.json({ id: person_id });
};

exports.compare = async (req, res) => {
  const collection_id = req.params.collection_id;
  const image = req.body.image;

  const url = `${baseUrl}/search`;
  const images = await Promise.all([resizeBase64(image)]);
  const postData = { images, collection_id };
  let results = [];
  try {
    const response = await axios.post(url, postData, IntercorpOptions);
    results = response.data.response;
  } catch {
    console.log("error found.");
  }

  return res.json(results);
};
