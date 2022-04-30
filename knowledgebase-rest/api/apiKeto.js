const express = require("express");
const router = express.Router();
const keto = require('../keto');

router.get("/checkRelation", (req, res) => {
    let subject_id = req.query.subject_id ?? "";
    let relation = req.body.relation ?? "";
    let object = req.body.object ?? "";

    keto.checkRelation(subject_id, relation, object, allowed => {
        res.json(allowed);
    });
});

router.post("/addRelation", (req, res) => {
    let subject_id = req.body.subject_id ?? "";
    let relation = req.body.relation ?? "";
    let object = req.body.object ?? "";

    keto.updateRelation(subject_id, relation, object, response => {
        res.json(response);
    });
});

router.get("/expandRelation", (req, res) => {
    let relation = req.query.relation ?? "";
    let object = req.query.object ?? "";

    keto.expandRelation(relation, object, response => {
        res.json(response);
    });
});

router.get("/queryRelation", (req, res) => {
    let subject = req.query.subject ?? "";
    let relation = req.query.relation ?? "";
    let object = req.query.object ?? "";

    keto.queryRelation(subject, relation, object, response => {
        res.json(response);
    });
});

router.delete("/deleteRelation", (req, res) => {
    let subject = req.query.subject ?? "";
    let relation = req.query.relation ?? "";
    let object = req.query.object ?? "";

    keto.deleteRelation(subject, relation, object, response => {
        res.json(response);
    });
});

module.exports = router;