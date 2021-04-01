import facebook from "../controllers/facebook-controller"
var express = require('express')
var router = express.Router()

router.post("/action", facebook.createAction);

router.post("/share", facebook.createSharePost);

router.delete("/action/:_id", facebook.deleteAction);


export default router;
