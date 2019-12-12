const axios = require("axios");
const misc = require("../../misc");
const options = require("../options");

const { fullOverwrite } = misc;
const overwrite = fullOverwrite("intercorp.json");

const { baseUrl, headers } = options;
const collectionId = process.env.COLLECTION_ID;

exports.list = (req, res, data) => {
  return res.json(data);
};

exports.create = async (req, res, data) => {
  const name = req.body.name;

  if (!(name in data)) {
    const url = `${baseUrl}/person`;
    const options = { headers };
    const postData = {
      name: name,
      person_id: `${name}Id`,
      collection_id: collectionId
    };
    await axios.post(url, postData, options);
    data[name] = { name, id: `${name}Id` };
    overwrite(data);

    return res.json(data[name]);
  } else return res.status(500).send("Name already exists.");
};

exports.delete = async (req, res, data) => {
  const name = req.body.name;

  if (name in data) {
    const personData = JSON.parse(JSON.stringify(data[name]));
    const url = `${baseUrl}/person/${collectionId}/${name}Id`;
    const options = { headers };
    await axios.delete(url, options);
    delete data[name];
    overwrite(data);

    return res.json(personData);
  } else return res.status(500).send("Name already exists.");
};
