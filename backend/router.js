const express = require("express");
const controller = require("./controller");

const router = express.Router();

router.get("/intercorp/collection", controller.collection_list);
router.post("/intercorp/collection", controller.collection_create);
router.delete("/intercorp/collection", controller.collection_delete);

router.get("/intercorp/person", controller.person_list);
router.post("/intercorp/person", controller.person_create);
router.delete("/intercorp/person", controller.person_delete);
router.post("/intercorp/face", controller.face_create);
router.post("/intercorp/enroll", controller.face_enroll);
router.delete("/intercorp/erase", controller.face_erase);
router.post("/intercorp/compare", controller.face_compare);

router.post("/meraki/snap", controller.meraki_snap);

module.exports = router;
