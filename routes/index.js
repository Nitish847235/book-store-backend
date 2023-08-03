const express = require("express")

const router = express.Router();

router.use('/userapp/auth',require('./auth'))

module.exports = router;