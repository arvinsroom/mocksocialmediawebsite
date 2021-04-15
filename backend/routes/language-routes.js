import language from "../controllers/language-controller";
var express = require('express');
var router = express.Router();

router.post("/", language.create);

router.get("/:_id", language.getLanguages);

router.put("/", language.updateLanActive);

export default router;
