const axios = require("axios");
const options = require("../options");

const { baseUrl, headers } = options;

exports.list = async (req, res) => {
  const url = `${baseUrl}/collections`;
  const options = { headers };
  const collections = await axios.get(url, options);
  return res.json(collections.data.response);
};

exports.create = async (req, res) => {
  const url = `${baseUrl}/collection`;
  const name = req.body.name;
  const options = { headers };
  const postData = {
    name: name,
    id: `${name}Id`
  };
  const collections = await axios.post(url, postData, options);
  return res.json(collections.data.response);
};

exports.delete = async (req, res) => {
  const id = req.body.id;
  const url = `${baseUrl}/collection/${id}`;
  const options = { headers };
  console.log(url, options);
  await axios.delete(url, options);
  return res.json({});
};
