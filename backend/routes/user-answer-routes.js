import answer from "../controllers/user-answer-controller"
var express = require('express')
var router = express.Router()

router.post("/mcq", answer.createMCQ);
router.post("/opentext", answer.createOpentext);

export default router;
