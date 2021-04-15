import userInfo from "../controllers/info-controller";
var express = require('express')
var router = express.Router()

router.get("/:pageId", userInfo.getInfoDetails);

export default router;
