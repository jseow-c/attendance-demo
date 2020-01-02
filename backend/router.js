const express = require("express");
const controller = require("./controller");

const router = express.Router();

const collectionString = "/intercorp/collection";
const personString = "/intercorp/collection/:collection_id/person";
const compareString = "/intercorp/collection/:collection_id/compare";

router.get(`${collectionString}`, controller.collection_list);
router.post(`${collectionString}`, controller.collection_create);
router.delete(`${collectionString}`, controller.collection_delete);

router.get(`${personString}`, controller.person_list);
router.post(`${personString}`, controller.person_create);
router.delete(`${personString}/:person_id`, controller.person_delete);

router.post(`${compareString}`, controller.person_compare);

// router.post("/intercorp/face", controller.face_create);
// router.post("/intercorp/enroll", controller.face_enroll);
// router.delete("/intercorp/erase", controller.face_erase);
// router.post("/intercorp/compare", controller.face_compare);

router.post("/meraki/snap", controller.meraki_snap);

module.exports = router;
