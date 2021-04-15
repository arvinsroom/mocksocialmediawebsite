import questions from "../controllers/question-controller";
var express = require('express')
var router = express.Router()

router.get("/:pageId/:type", questions.fetchAllQuestions);

export default router;
