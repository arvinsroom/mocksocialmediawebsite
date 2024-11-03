import userMedia from "../controllers/user-media-controller";

var express = require("express");
var router = express.Router();

// stream media
router.get("/stream/:pageId/:mediaPath", userMedia.streamMedia);

export default router;
