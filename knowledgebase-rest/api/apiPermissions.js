const express = require("express");
const router = express.Router();
const pgQueries = require('../postgres/permission-queries');

router.get("/getPermissions", (req, res) => {
    pgQueries.getPermissions(result => {
        if(result.err){
            result.err.errorIndex = 3821;
            return res.status(500).json(result.err);
        }

        res.json(result.res);
    });
});

module.exports = router;