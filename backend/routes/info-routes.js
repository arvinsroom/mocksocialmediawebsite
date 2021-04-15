import info from "../controllers/info-controller"
var express = require('express')
var router = express.Router()

router.post("/", info.create);

export default router;
