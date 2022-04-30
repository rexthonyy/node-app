const express = require("express");
const router = express.Router();
const util = require('../util');
const consts = require('../consts');

router.get("/getCategories", util.authenticateToken, (req, res) => {
    if(consts.roles.role1.find(userType => userType == req.user.userType)){
        res.json({
            status: "success",
            categories: [
                'This is the default role'
            ]
        });
    }else if(consts.roles.role2.find(userType => userType == req.user)){
        res.json({
            status: "success",
            categories: [
                'mechanic category items'
            ]
        });
    }
});

module.exports = router;