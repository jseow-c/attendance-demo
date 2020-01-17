const axios = require("axios");
const sharp = require("sharp");
const HttpsProxyAgent = require("https-proxy-agent");
const options = require("../options");

const { baseUrl, headers } = options;
const IntercorpOptions = { headers };

// adds proxy to aws config if required
// proxy stated in environment as PROXY
if (process.env.PROXY) {
  IntercorpOptions.proxy = false;
  IntercorpOptions.httpsAgent = new HttpsProxyAgent(process.env.PROXY);
}

/**
 * Returns a list of people based on collection_id from Intercorp
 * @param {string} req.params.collection_id id of collection
 * @return {json} [{collection_id, person_id, name, thumbnail}, ...] - an array of details of people
 */
exports.list = async (req, res) => {
  const collection_id = req.params.collection_id;
  const url = `${baseUrl}/persons/${collection_id}`;
  const persons = await axios.get(url, IntercorpOptions);
  return res.json(persons.data.response);
};

/**
 * Resize image in order to fit Intercorp limitation
 * @param {base64 string} base64Image base64 string of the image to be resized
 * @return {base64 string} base64 string of the resized image
 */
const resizeBase64 = async base64Image => {
  // remove the metadata of the base64 string
  let parts = base64Image.split(";");
  let imageData = parts[1].split(",")[1];

  // creates a buffer and resize it and converts it back to string
  var buffer = new Buffer.from(imageData, "base64");
  const resizedBuffer = await sharp(buffer)
    .jpeg({ quality: 60 })
    // .resize({ width: 350 })
    .toBuffer();
  return resizedBuffer.toString("base64");
};

/**
 * Enroll a person into a collection based on collection_id in Intercorp
 * @param {string} req.params.collection_id id of collection
 * @param {string} req.body.name name of person
 * @param {base64 string} req.body.image base64 string of an image
 * @return {json} {collection_id, person_id, name, thumbnail} - details of the person
 */
exports.create = async (req, res) => {
  const collection_id = req.params.collection_id;
  const person_name = req.body.name;
  const image = req.body.image;
  const person_id = `${person_name.replace(/\s+/g, "")}Id`;

  // enroll person in Intercorp
  // note: need to resize the image before proceeding
  const url = `${baseUrl}/enrollment`;
  const images = await Promise.all([resizeBase64(image)]);
  const postData = { images, person_name, person_id, collection_id };
  await axios.post(url, postData, IntercorpOptions);

  // get person's details to ensure that the person is enrolled
  const personUrl = `${baseUrl}/person/${collection_id}/${person_id}`;
  const response = await axios.get(personUrl, IntercorpOptions);

  return res.json(response.data.response);
};

/**
 * Delete a person from a collection based on collection_id in Intercorp
 * @param {string} req.params.collection_id id of collection
 * @param {string} req.params.person_id id of a person
 * @return {json} {id} - id of the person
 */
exports.delete = async (req, res) => {
  const collection_id = req.params.collection_id;
  const person_id = req.params.person_id;

  const url = `${baseUrl}/person/${collection_id}/${person_id}`;
  await axios.delete(url, IntercorpOptions);
  return res.json({ id: person_id });
};

/**
 * Compares an image and find the closest match for each face in the image
 * @param {string} req.params.collection_id id of the collection
 * @param {base64 string} req.body.image base64 string of the image to be compared
 * @return {json} [{collection_id, person_id, confidence, person_name, thumbnail}, ...] - an array of details of matched faces in the image
 */
exports.compare = async (req, res) => {
  const collection_id = req.params.collection_id;
  const image = req.body.image;

  // note: need to resize the image before proceeding
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
