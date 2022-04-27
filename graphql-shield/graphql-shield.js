require("dotenv").config();
const express = require('express');
const app = express();
app.use(express.json());

let port = process.env.PORT || 1000;
var lesServer = app.listen(port, function() {
    console.log("Listening on port %s...", lesServer.address().port);
});