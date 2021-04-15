import finishScreen  from "../controllers/finish-controller"
var express = require('express')
var router = express.Router()

router.post("/", finishScreen.create);

export default router;
