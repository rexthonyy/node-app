const express = require("express");
const router = express.Router();
const util = require('../util');
const consts = require('../consts');
const keto = require('../keto');
const jwt = require('jsonwebtoken');
const Kafka = require('node-rdkafka');
const stream = Kafka.Producer.createWriteStream({
    'metadata.broker.list': process.env.KAFKA_URL
}, {}, { topic: "userCreated" });

stream.on('error', (err) => {
    console.error('Error in our kafka stream');
    console.error(err);
});

router.post("/register", (req, res) => {
    let email = req.body.credentials.email ?? "";
    let password = req.body.credentials.password ?? "";
    let firstName = req.body.credentials.firstName ?? "";
    let lastName = req.body.credentials.lastName ?? "";

    let job_category_id = req.body.job.category_id ?? null;
    let job_subcategory_id = req.body.job.subcategory_id ?? null;

    let role_id = req.body.role.role_id ?? null;

    email = email.trim().toLowerCase();
    firstName = firstName.trim();
    lastName = lastName.trim();

    if(!util.isEmailValid(email)) return res.json({ status: "error", message: "Email format not supported" });
    if(password.length < 6) return res.json({ status: "error", message: "Password must be 6 or more characters" });

    if(firstName.length == 0) return res.json({ status: "error", message: "Please enter your first name" });
    if(lastName.length == 0) return res.json({ status: "error", message: "Please enter your last name" });
    if(!job_category_id) return res.json({ status: "error", message: "Please enter your job category" });
    if(!job_subcategory_id) return res.json({ status: "error", message: "Please enter your job sub category" });
    if(!role_id) return res.json({ status: "error", message: "Please enter your role" });

    let userMeta = JSON.stringify({
        login: {
            password
        }, 
        jobs: [
            {
                category_id: job_category_id,
                subcategory_id: job_subcategory_id
            }
        ],
        roles: [
            role_id
        ]
    });

    let endpoint = `${consts.KRATOS_ROOT}:4434/identities`;
    let options =  {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            schema_id: "default",
            state: "active",
            traits: {
                email: email,
                name: {
                    first: firstName,
                    last: lastName
                },
                meta: userMeta
            }
        })
    };
    util.sendRequest(endpoint, options)
    .then(json => {    
        let identity_id = json.id;

        if(identity_id == null) return res.status(401).json({ status: "error", message: "Email is already registered" });
        
        const content = JSON.stringify({
            identity_id,
            role_id
        });
    
        const success = stream.write(Buffer.from(content));
        if(success){
            let token = {
                identity_id: identity_id,
                email: email
            };
            // create the access token for this user
            const accessToken = jwt.sign(token, process.env.ACCESS_TOKEN_SECRET);

            res.json({ status: "success", message: "User created successfully!", access_token: accessToken });
        }else{
            res.status(500).json({ status: "error", message: "Internal error" });
        }
    }).catch(err => {
        console.error(err);
        res.status(500).json({ status: 500, message: "Internal error" });
    });
});

function listenForUserCreated(){
    const consumer = Kafka.KafkaConsumer({
        'group.id': 'kafka',
        'metadata.broker.list': 'localhost:9092'
    }, {});

    consumer.connect();

    consumer.on('ready', () => {
        console.log("consumer is ready...");
        consumer.subscribe(['userCreated']);
        consumer.consume();
    }).on('data', function(data) {
        let user = JSON.parse(data.value);
        if(user != null){
            userCreatedListener(user);
        }else{
            console.log("user undefined");
        }
    });
}

listenForUserCreated();

function userCreatedListener(userData){
    keto.updateRelation(userData.identity_id, "user_role", userData.role_id+"", response => {
        console.log(response);
    });
}

router.post("/createJob", (req, res) => {
    let job_category = req.body.job_category ? req.body.job_category : "";
    let job_subcategory = req.body.job_subcategory ? req.body.job_subcategory : "";

    let user_id = 300;
/*
    pgQueries.getGroupByGroupName(job_category, result => {
        if(result.err){
            result.err.errorIndex = 728282922;
            return res.status(500).json(result.err);
        }

        if(result.res.length == 0) res.status(400).json({ status: 404, message: "Job group not found" });

        let job_group_id = result.res[0].id;

        let values = [
            user_id,
            job_group_id,
            ""
        ];
        
        pgQueries.createGroupsUsers(values, result => {
            if(result.err){
                result.err.errorIndex = 78282922;
                return res.status(500).json(result.err);
            }

            res.json({ status: "Success", message: "User group created successfully" });
        });
    });
*/

});

module.exports = router;