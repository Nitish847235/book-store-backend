const express = require("express")

const router = express.Router();

router.use('/userapp/auth',require('./auth'))
router.use('/userapp/cart',require('./cart'))

module.exports = router;