import tracking from "../controllers/user-tracking-controller"
var express = require('express')
var router = express.Router()

router.post("/post", tracking.createOrUpdatePostTrackingData);

router.post("/global", tracking.createOrUpdateGlobalPageMetaData);

export default router;
