import userMedia from "../controllers/user-media-controller";
var express = require('express')
var router = express.Router()

router.get("/:pageId", userMedia.getDefaultPosts);

export default router;
