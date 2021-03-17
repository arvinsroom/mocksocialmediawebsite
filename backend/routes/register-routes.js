import register  from "../controllers/register-controller"
var express = require('express')
var router = express.Router()

router.post("/", register.create);

export default router;
