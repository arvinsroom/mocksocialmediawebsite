import template  from "../controllers/template-controller.js"
var express = require('express')
var router = express.Router()

router.post("/", template.create);

export default router;
