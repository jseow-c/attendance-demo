const AWS = require("aws-sdk");
const proxy = require("proxy-agent");
const sharp = require("sharp");

if (process.env.PROXY) {
  AWS.config.update({
    httpOptions: { agent: proxy(process.env.PROXY) }
  });
}

const rekognition = new AWS.Rekognition();
const s3 = new AWS.S3();
const dynamodb = new AWS.DynamoDB();

exports.list = async (req, res) => {
  const collection_id = req.params.collection_id;
  const params = { CollectionId: collection_id };
  const response = await rekognition.listFaces(params).promise();
  return res.json(response);
};

const resizeBase64 = async base64Image => {
  let parts = base64Image.split(";");
  let imageData = parts[1].split(",")[1];

  var buffer = new Buffer.from(imageData, "base64");
  const resizedBuffer = await sharp(buffer)
    .resize({ width: 350 })
    .toBuffer();
  return resizedBuffer.toString("base64");
};

exports.create = async (req, res) => {
  const collection_id = req.params.collection_id;
  const person_name = req.body.name;
  const image = req.body.image;
  const person_id = `${person_name.replace(/\s+/g, "")}Id`;

  // const url = `${baseUrl}/enrollment`;
  // const images = await Promise.all([resizeBase64(image)]);
  // const postData = { images, person_name, person_id, collection_id };
  // await axios.post(url, postData, IntercorpOptions);

  // const personUrl = `${baseUrl}/person/${collection_id}/${person_id}`;
  // const response = await axios.get(personUrl, IntercorpOptions);

  // return res.json(response.data.response);
};

// exports.delete = async (req, res) => {
//   const collection_id = req.params.collection_id;
//   const person_id = req.params.person_id;

//   const url = `${baseUrl}/person/${collection_id}/${person_id}`;
//   await axios.delete(url, IntercorpOptions);
//   return res.json({ id: person_id });
// };

// exports.compare = async (req, res) => {
//   const collection_id = req.params.collection_id;
//   const image = req.body.image;

//   const url = `${baseUrl}/search`;
//   const images = await Promise.all([resizeBase64(image)]);
//   const postData = { images, collection_id };
//   const response = await axios.post(url, postData, IntercorpOptions);

//   return res.json(response.data.response);
// };
