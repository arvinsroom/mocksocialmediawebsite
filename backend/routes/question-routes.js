import questions from "../controllers/question-controller"
var express = require('express')
var router = express.Router()

router.post("/", questions.create);

export default router;
