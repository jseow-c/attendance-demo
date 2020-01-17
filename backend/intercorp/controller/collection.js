const axios = require("axios");
const options = require("../options");
const HttpsProxyAgent = require("https-proxy-agent");

const { baseUrl, headers } = options;
const IntercorpOptions = { headers };

// adds proxy to aws config if required
// proxy stated in environment as PROXY
if (process.env.PROXY) {
  IntercorpOptions.proxy = false;
  IntercorpOptions.httpsAgent = new HttpsProxyAgent(process.env.PROXY);
}

/**
 * Returns a list of collections from Intercorp
 * @return {json} [{id, name}, ...]
 */
exports.list = async (req, res) => {
  const url = `${baseUrl}/collections`;
  const collections = await axios.get(url, IntercorpOptions);
  return res.json(collections.data.response);
};

/**
 * Create a collection in Intercorp
 * @param {string} req.body.name name of collection
 * @return {json} {id, name}
 */
exports.create = async (req, res) => {
  const url = `${baseUrl}/collection`;
  const name = req.body.name;

  // create an id based on name
  const id = `${name.replace(/\s+/g, "")}Id`;

  const postData = { name, id };
  const response = await axios.post(url, postData, IntercorpOptions);
  return res.json(response.data.response);
};

/**
 * Delete a collection based on id in Intercorp
 * @param {string} req.body.id id of the collection
 * @return {null}
 */
exports.delete = async (req, res) => {
  const id = req.body.id;
  const url = `${baseUrl}/collection/${id}`;
  await axios.delete(url, IntercorpOptions);
  return res.json({});
};
