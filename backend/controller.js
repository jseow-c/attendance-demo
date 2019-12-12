// const model = require("./model");
const collectionController = require("./intercorp/controller/collection");
const personController = require("./intercorp/controller/person");
const faceController = require("./intercorp/controller/face");
const merakiController = require("./meraki/controller");

// initialize data
let intercorpData;
// model().then(response => {
//   intercorpData = response.intercorpData;
// });

// Intercorp Collection Controllers
exports.collection_list = (req, res) => collectionController.list(req, res);
exports.collection_create = (req, res) => collectionController.create(req, res);
exports.collection_delete = (req, res) => collectionController.delete(req, res);

// Intercorp Person Controllers
exports.person_list = (req, res) =>
  personController.list(req, res, intercorpData);
exports.person_create = (req, res) =>
  personController.create(req, res, intercorpData);
exports.person_delete = (req, res) =>
  personController.delete(req, res, intercorpData);

// Intercorp Face Controllers
exports.face_create = (req, res) =>
  faceController.create(req, res, intercorpData);
exports.face_enroll = (req, res) =>
  faceController.enroll(req, res, intercorpData);
exports.face_erase = (req, res) =>
  faceController.erase(req, res, intercorpData);
exports.face_compare = (req, res) =>
  faceController.compare(req, res, intercorpData);

exports.meraki_snap = (req, res) => merakiController.snap(req, res);
