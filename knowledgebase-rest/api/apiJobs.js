const express = require("express");
const router = express.Router();
const keto = require('../keto');

router.patch("/addJobRole", (req, res) => {
    let category_id = req.body.category_id ?? "";
    let meta = req.body.meta ?? "";
    let relation = "job_role_meta";

    keto.queryRelation(category_id+"", relation, "", response => {
        let relations = response.relation_tuples;
        if(relations.length == 0){
            keto.updateRelation(category_id+"", relation, meta, response => {
                res.json(response);
            }); 
        }else{
            let numRelations = relations.length;
            let count = -1;

            relations.forEach(rel => {
                keto.deleteRelation(rel.subject_id, rel.relation, rel.object, response => {
                   checkComplete();
                });
            });

            checkComplete();

            function checkComplete(){
                count++;
                if(numRelations == count){
                    keto.updateRelation(category_id+"", relation, meta, response => {
                        res.json(response);
                    }); 
                }
            }
        }
    });
});

router.get("/getJobRole", (req, res) => {
    let subject = req.query.category_id ?? "";
    let relation = "job_role_meta";
    let object = "";

    keto.queryRelation(subject, relation, object, response => {
        let relations = response.relation_tuples;
        if(relations.length == 0){
            res.status(404).json({status: "Not found"});
        }else{
            res.json(relations[0]);
        }
    });
});

router.delete("/deleteJobRole", (req, res) => {
    let subject = req.query.category_id ?? "";
    let relation = "job_role_meta";
    let object = "";

    keto.queryRelation(subject, relation, "", response => {
        let relations = response.relation_tuples;
        if(relations.length == 0){
            res.status(404).json({status: "Not found"});
        }else{
            let rel = relations[0];
            object = rel.object;
            keto.deleteRelation(subject, relation, object, response => {
                keto.queryRelation(subject, relation, "", response => {
                    relations = response.relation_tuples;
                    if(relations.length == 0){
                        res.json({status: "success", message: "Job role deleted successfully" });
                    }else{
                        res.json({status: "failed", message: "Job role could not be deleted" });
                    }
                });
            });
        }
    });
});

module.exports = router;