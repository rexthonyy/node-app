const express = require("express");
const router = express.Router();
const signupRouter = require('./signup');

router.use(signupRouter);

module.exports = router;