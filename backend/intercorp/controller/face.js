const axios = require("axios");
const fetch = require("node-fetch");
const misc = require("../../misc");
const options = require("../options");
const sharp = require("sharp");

const { fullOverwrite } = misc;
const overwrite = fullOverwrite("intercorp.json");

const { baseUrl, headers } = options;
const collectionId = process.env.COLLECTION_ID;
const collectionName = process.env.COLLECTION_NAME;

const convertToBase64 = async url => {
  const response = await fetch(url);
  const buffer = await response.buffer();
  const resizedBuffer = await sharp(buffer)
    .resize({ width: 350 })
    .toBuffer();
  return resizedBuffer.toString("base64");
};

exports.create = async (req, res, data) => {
  const name = req.body.name;
  const photoUrl = req.body.url;

  if (name in data) {
    const url = `${baseUrl}/face`;
    const options = { headers };
    const thumbnail = await convertToBase64(photoUrl);
    const postData = {
      thumbnail,
      person_id: `${name}Id`,
      collection_id: collectionId
    };
    await axios.post(url, postData, options);
    overwrite(data);

    return res.json({ name, id: `${name}Id`, thumbnail });
  } else return res.status(500).send("Name doesn't exist.");
};

exports.compare = async (req, res, data) => {
  const photoUrl = req.body.url;
  const url = `${baseUrl}/search`;
  const options = { headers };
  const thumbnail = await convertToBase64(photoUrl);
  const postData = {
    images: [thumbnail],
    collection_id: collectionId
  };
  let response;
  await axios
    .post(url, postData, options)
    .then(res => {
      response = res.data.response;
    })
    .catch(err => console.log(err.response.statusText));

  if (response && response.length > 0) {
    return res.json(response[0]);
  } else {
    return res.status(500).send("No match found.");
  }
};

/**
 * Enroll Person into the Collection with Faces
 * @param {Request} req Request for the RESTApi
 * @param {Response} res Response for the RESTApi
 * @param {Object} data Intercorp data which stores an object of Persons in Collection
 */
exports.enroll = async (req, res, data) => {
  const name = req.body.name;
  const photoUrls = req.body.urls;

  const url = `${baseUrl}/enrollment`;
  const options = { headers };
  const images = await Promise.all(
    photoUrls.map(photo => convertToBase64(photo))
  );
  const postData = {
    images,
    person_name: name,
    person_id: `${name}Id`,
    collection_id: collectionId,
    collection_name: collectionName
  };
  await axios.post(url, postData, options);
  if (!name in data) data[name] = { id: `${name}Id`, name };
  overwrite(data);

  return res.json({ name, id: `${name}Id`, imageCount: photoUrls.length });
};

/**
 * Erase a Person from the Collection together with his/her Faces
 * @param {Request} req Request for the RESTApi
 * @param {Response} res Response for the RESTApi
 * @param {Object} data Intercorp data which stores an object of Persons in Collection
 */
exports.erase = async (req, res, data) => {
  const name = req.body.name;
  if (name in data) {
    const url = `${baseUrl}/enrollment/${collectionId}/${name}Id`;
    const options = { headers };
    await axios.delete(url, options);
    delete data[name];
    overwrite(data);
    return res.json({ name, id: `${name}Id` });
  } else return res.status(500).send("Name doesn't exist.");
};
