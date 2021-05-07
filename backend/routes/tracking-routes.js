import tracking from "../controllers/tracking-controller"
var express = require('express')
var router = express.Router()

router.post("/", tracking.create);

export default router;
