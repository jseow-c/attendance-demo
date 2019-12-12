// Model Files
const axios = require("axios");
const intercorpOptions = require("./intercorp/options");

const getIntercorpData = async _ => {
  // get or create collection
  const id = process.env.COLLECTION_ID;
  const name = process.env.COLLECTION_NAME;
  const url = `${intercorpOptions.baseUrl}/collections`;
  const options = { headers: intercorpOptions.headers };
  const collections = await axios.get(url, options);
  const envCollection = collections.data.response.filter(
    item => item.id === id
  );
  if (envCollection.length === 0) {
    const createCollectionUrl = `${intercorpOptions.baseUrl}/collection`;
    await axios.post(createCollectionUrl, { id, name }, options);
  }
  // get persons in collection
  const personUrl = `${intercorpOptions.baseUrl}/persons/${id}`;
  const personsResponse = await axios.get(personUrl, options);
  return personsResponse.data.response.reduce((acc, cur) => {
    acc[cur.name] = { name, id: cur.person_id };
    return acc;
  }, {});
};

module.exports = async _ => {
  // get intercorp data
  const intercorpData = await getIntercorpData();

  return { intercorpData };
};
