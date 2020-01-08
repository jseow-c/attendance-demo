const express = require("express");
const controller = require("./controller");

const router = express.Router();

const iCollectionString = "/intercorp/collection";
const iPersonString = "/intercorp/collection/:collection_id/person";
const iCompareString = "/intercorp/collection/:collection_id/compare";

const aCollectionString = "/aws/collection";
const aPersonString = "/aws/collection/:collection_id/person";
const aCompareString = "/aws/collection/:collection_id/compare";

// Intercorp
router.get(`${iCollectionString}`, controller.i_collection_list);
router.post(`${iCollectionString}`, controller.i_collection_create);
router.delete(`${iCollectionString}`, controller.i_collection_delete);

router.get(`${iPersonString}`, controller.i_person_list);
router.post(`${iPersonString}`, controller.i_person_create);
router.delete(`${iPersonString}/:person_id`, controller.i_person_delete);

router.post(`${iCompareString}`, controller.i_person_compare);

// AWS
router.get(`${aCollectionString}`, controller.a_collection_list);
router.post(`${aCollectionString}`, controller.a_collection_create);
router.delete(`${aCollectionString}`, controller.a_collection_delete);

router.get(`${aPersonString}`, controller.a_person_list);
router.post(`${aPersonString}`, controller.a_person_create);
router.delete(`${aPersonString}/:person_id`, controller.a_person_delete);

router.post(`${aCompareString}`, controller.a_person_compare);

router.post("/meraki/snap", controller.meraki_snap);

module.exports = router;
