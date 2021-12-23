const express = require('express');
const router = express.Router();
const radarCtrl = require('../controllers/radarController');

router.post('/', radarCtrl.radarResponse);

module.exports = router;