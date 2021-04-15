import language from "../controllers/language-controller";
var express = require('express');
var router = express.Router();

router.get("/language/mock", language.getMockAllLanguages);

router.get("/language/mock/:language", language.getMockLanguage);

export default router;
