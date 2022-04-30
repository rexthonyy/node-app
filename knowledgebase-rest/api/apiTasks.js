const express = require("express");
const router = express.Router();
const utils = require('../util');
const Kafka = require('node-rdkafka');
const stream = Kafka.Producer.createWriteStream({
    'metadata.broker.list': process.env.KAFKA_URL
}, {}, { topic: "taskReview" });

stream.on('error', (err) => {
    console.error('Error in our kafka stream');
    console.error(err);
});

router.post("/sendServiceReviewForTask", (req, res) => {
    let buyer_id = req.body.buyer_id ?? null;
    let seller_id = req.body.seller_id ?? null;
    let task_id = req.body.task_id ?? null;
    let job_id = req.body.job_id ?? null;
    let rating = req.body.rating ?? null;
    let title = req.body.title ?? "";
    let message = req.body.message ?? "";
    let user_type = req.body.user_type ?? null;

    sendServiceReviewForTask(req, res, buyer_id, seller_id, task_id, job_id, rating, title, message, user_type, "publish_review", true, response => {
        res.json(response);
    });
});

function sendServiceReviewForTask(req, res, buyer_id, seller_id, task_id, job_id, rating, title, message, user_type, reviewType, is_published, cb){
    let appDigitalSignature = process.env.ZAMMAD_APP_DIGITAL_SIGNATURE;
    
    if(buyer_id == null) return cb({ status: "error", message: "Please specify the buyer id" });
    if(seller_id == null) return cb({ status: "error", message: "Please specify the seller id" });
    if(task_id == null) return cb({ status: "error", message: "Please specify the task id" });
    if(job_id == null) return cb({ status: "error", message: "Please specify the job id" });
    if(rating == null) return cb({ status: "error", message: "Please specify the rating" });
    if(user_type == null) return cb({ status: "error", message: "Please specify the user type (buyer | seller)" });
    if(!(user_type == "buyer" || user_type == "seller")) return cb({ status: "error", message: "user_type must be either buyer or seller" });
    
    if(!userExists(buyer_id)) return cb({ status: "error", message: "Buyer does not exist" });
    if(!userExists(seller_id)) return cb({ status: "error", message: "Seller does not exist" });
    if(!jobExists(job_id)) return cb({ status: "error", message: "Job does not exist" });
    if(!taskExists(task_id)) return cb({ status: "error", message: "Task does not exist" });
    if(getTaskStatus(task_id) != "completed") return cb({ status: "error", message: "Task does not exist" });
    
    const content = JSON.stringify({
        reviewType,
        appDigitalSignature,
        buyer_id,
        seller_id,
        task_id,
        job_id,
        rating,
        title,
        message,
        user_type,
        is_published
    });

    const success = stream.write(Buffer.from(content));
    if(success){
        cb({ status: "success", message: "Review sent successfully!" });
    }else{
        cb({ status: "error", message: "Internal error" });
    }
}

router.patch("/updateServiceReviewForTask", (req, res) => {
    let review_id = req.body.review_id ?? null;
    let buyer_id = req.body.buyer_id ?? null;
    let seller_id = req.body.seller_id ?? null;
    let task_id = req.body.task_id ?? null;
    let job_id = req.body.job_id ?? null;
    let rating = req.body.rating ?? null;
    let title = req.body.title ?? "";
    let message = req.body.message ?? "";
    let user_type = req.body.user_type ?? null;
    let is_published = req.body.is_published ?? true;

    updateServiceReviewForTask(req, res, review_id, buyer_id, seller_id, task_id, job_id, rating, title, message, user_type, "update_review", is_published, response => {
        res.json(response);
    });
});

function updateServiceReviewForTask(req, res, review_id, buyer_id, seller_id, task_id, job_id, rating, title, message, user_type, reviewType, is_published, cb){
    let appDigitalSignature = process.env.ZAMMAD_APP_DIGITAL_SIGNATURE;
    
    if(buyer_id == null) return cb({ status: "error", message: "Please specify the buyer id" });
    if(seller_id == null) return cb({ status: "error", message: "Please specify the seller id" });
    if(task_id == null) return cb({ status: "error", message: "Please specify the task id" });
    if(job_id == null) return cb({ status: "error", message: "Please specify the job id" });
    if(rating == null) return cb({ status: "error", message: "Please specify the rating" });
    if(user_type == null) return cb({ status: "error", message: "Please specify the user type (buyer | seller)" });
    if(!(user_type == "buyer" || user_type == "seller")) return cb({ status: "error", message: "user_type must be either buyer or seller" });
    
    if(!userExists(buyer_id)) return cb({ status: "error", message: "Buyer does not exist" });
    if(!userExists(seller_id)) return cb({ status: "error", message: "Seller does not exist" });
    if(!jobExists(job_id)) return cb({ status: "error", message: "Job does not exist" });
    if(!taskExists(task_id)) return cb({ status: "error", message: "Task does not exist" });
    if(getTaskStatus(task_id) != "completed") return cb({ status: "error", message: "Task does not exist" });
    
    const content = JSON.stringify({
        reviewType,
        appDigitalSignature,
        review_id,
        buyer_id,
        seller_id,
        task_id,
        job_id,
        rating,
        title,
        message,
        user_type,
        is_published
    });

    const success = stream.write(Buffer.from(content));
    if(success){
        cb({ status: "success", message: "Update review sent successfully!" });
    }else{
        cb({ status: "error", message: "Internal error" });
    }
}

router.delete("/deleteServiceReviewForTask", (req, res) => {

});

function userExists(user_id){
    return true;
}

function jobExists(job_id){
    return true;
}

function taskExists(task_id){
    return true;
}

function getTaskStatus(task_id){
    return "completed";
}

module.exports = router;