const express = require("express");
const router = express.Router();
const Kafka = require('node-rdkafka');
const pgQueries = require('../../postgres/review-queries');

const consumer = Kafka.KafkaConsumer({
    'group.id': 'kafka',
    'metadata.broker.list': process.env.KAFKA_URL
}, {});

consumer.connect();

consumer.on('ready', () => {
    console.log("task review published consumer is ready...");
    consumer.subscribe(['taskReview']);
    consumer.consume();
}).on('data', function(data) {
    let review = JSON.parse(data.value);
    if(review != null){
        switch(review.reviewType){
            case "publish_review":
                publishReviewListener(review);
            break;

            case "update_review":
                updateReviewListener(review);
            break;

            case "delete_review":
                deleteReviewListener(review);
            break;
        }
    }else{
        console.log("review undefined");
    }
});

function publishReviewListener(review){
    if(process.env.ZAMMAD_APP_DIGITAL_SIGNATURE != review.appDigitalSignature) 
        return console.log("Invalid app digital signature");

    let values = [
        review.task_id,
        review.job_id,
        review.buyer_id,
        review.seller_id,
        review.user_type,
        review.title,
        review.message,
        review.rating,
        new Date().toUTCString(),
        new Date().toUTCString(),
        review.is_published
    ];

    pgQueries.createReview(values, result => {
        if(result.err){
            result.err.errorIndex = 728332922;
            return console.log(result.err);
        }

        console.log(result.res);
    });
}

function updateReviewListener(review){
    if(process.env.ZAMMAD_APP_DIGITAL_SIGNATURE != review.appDigitalSignature) 
        return console.log("Invalid app digital signature");

    let values = [
        review.review_id,
        review.task_id,
        review.job_id,
        review.buyer_id,
        review.seller_id,
        review.user_type,
        review.title,
        review.message,
        review.rating,
        new Date().toUTCString(),
        review.is_published
    ];

    pgQueries.updateReview(values, result => {
        if(result.err){
            result.err.errorIndex = 28332922;
            return console.log(result.err);
        }

        console.log(result.res);
    });
}

function deleteReviewListener(review){
    if(process.env.ZAMMAD_APP_DIGITAL_SIGNATURE != review.appDigitalSignature) 
        return console.log("Invalid app digital signature");

    let values = [
        review.id
    ];

    pgQueries.deleteReview(values, result => {
        if(result.err){
            result.err.errorIndex = 2832;
            return console.log(result.err);
        }

        console.log(result.res);
    });
}

module.exports = router;