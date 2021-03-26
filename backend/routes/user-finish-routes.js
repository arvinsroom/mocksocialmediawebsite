import userFinish from "../controllers/finish-controller";
var express = require('express')
var router = express.Router()

router.get("/:pageId", userFinish.getFinishDetails);

export default router;
