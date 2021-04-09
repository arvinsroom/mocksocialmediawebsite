import adminMetrics  from "../controllers/admin-metrics-controller"
var express = require('express')
var router = express.Router()

router.get("/allusers/:adminId/:templateId?/:userId?", adminMetrics.getUserData);

router.get("/templates/allusers/counts", adminMetrics.getTemplatesWithUserCounts);


export default router;
