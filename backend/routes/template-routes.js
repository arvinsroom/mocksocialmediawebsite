import template  from "../controllers/template-controller.js"
var express = require('express')
var router = express.Router()

router.post("/", template.create);

router.get("/", template.getPrevTemplates);

router.delete("/:_id", template.deletePrevTemplate);


export default router;
