const axios = require("axios");
const options = require("../options");
const HttpsProxyAgent = require("https-proxy-agent");

const { baseUrl, headers } = options;

const IntercorpOptions = { headers };
if (process.env.PROXY) {
  IntercorpOptions.proxy = false;
  IntercorpOptions.httpsAgent = new HttpsProxyAgent(process.env.PROXY);
}

exports.list = async (req, res) => {
  const url = `${baseUrl}/collections`;
  const collections = await axios.get(url, IntercorpOptions);
  return res.json(collections.data.response);
};

exports.create = async (req, res) => {
  const url = `${baseUrl}/collection`;
  const name = req.body.name;
  const id = `${name.replace(/\s+/g, "")}Id`;
  const postData = { name, id };
  const response = await axios.post(url, postData, IntercorpOptions);
  return res.json(response.data.response);
};

exports.delete = async (req, res) => {
  const id = req.body.id;
  const url = `${baseUrl}/collection/${id}`;
  await axios.delete(url, IntercorpOptions);
  return res.json({});
};
