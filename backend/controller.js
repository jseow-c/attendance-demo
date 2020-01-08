// const model = require("./model");
const iCollectionCtrler = require("./intercorp/controller/collection");
const iPersonCtrler = require("./intercorp/controller/person");
const aCollectionCtrler = require("./aws/controller/collection");
const aPersonCtrler = require("./aws/controller/person");

const merakiController = require("./meraki/controller");

// Intercorp Collection Controllers
exports.i_collection_list = (req, res) => iCollectionCtrler.list(req, res);
exports.i_collection_create = (req, res) => iCollectionCtrler.create(req, res);
exports.i_collection_delete = (req, res) => iCollectionCtrler.delete(req, res);

// Intercorp Person Controllers
exports.i_person_list = (req, res) => iPersonCtrler.list(req, res);
exports.i_person_create = (req, res) => iPersonCtrler.create(req, res);
exports.i_person_delete = (req, res) => iPersonCtrler.delete(req, res);

// Intercorp Compare
exports.i_person_compare = (req, res) => iPersonCtrler.compare(req, res);

// AWS Collection Controllers
exports.a_collection_list = (req, res) => aCollectionCtrler.list(req, res);
exports.a_collection_create = (req, res) => aCollectionCtrler.create(req, res);
exports.a_collection_delete = (req, res) => aCollectionCtrler.delete(req, res);

// // AWS Person Controllers
exports.a_person_list = (req, res) => aPersonCtrler.list(req, res);
exports.a_person_create = (req, res) => aPersonCtrler.create(req, res);
exports.a_person_delete = (req, res) => aPersonCtrler.delete(req, res);

// // AWS Compare
exports.a_person_compare = (req, res) => aPersonCtrler.compare(req, res);

exports.meraki_snap = (req, res) => merakiController.snap(req, res);
