require('dotenv').config();
require('./postgres/initialize_dbs').init()
.then(() => {
    const express = require('express');
    const Sentry = require("@sentry/node");
    Sentry.init({ dsn: "http://dabbd6402425483688844c52168d83c5@88.208.212.249:8000/1" });
    var Multer = require("multer");
    var Minio = require("minio");
    var BodyParser = require("body-parser");
    const {postgraphile} = require("postgraphile");
    const cookieParser = require('cookie-parser');
    const cors = require('cors');
    const util = require('./util');
    const mapRouter = require('./api/apiMaps');
    const knowledgeBaseRouter = require('./api/apiKnowledgeBase');
    const forumRouter = require('./api/apiForums');
    const ticketsRouter = require('./api/apiTickets');
    const usersRouter = require('./api/apiUsers');
    const ketoRouter = require('./api/apiKeto');
    const jobRouter = require('./api/apiJobs');
    const taskRouter = require('./api/apiTasks');
    const permissionsRouter = require('./api/apiPermissions');
    const reviewsAppRouter = require('./apps/reviews/index');
    const currencyAndDiscountsRouter = require('./apps/currency_and_discounts/index');
    const dolibarrRouter = require('./apps/dolibarr/index');
    const configurationsRouter = require('./apps/configurations/index');
    
    const consts = require('./consts');
    
    const app = express();
    
    app.use(Sentry.Handlers.requestHandler());
    
    app.set('view engine', 'ejs');
    
    app.use(express.static('public'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(BodyParser.json({limit: "4mb"}));
    app.use(cookieParser());
    //app.use(cors());

    // app.use(
    //     postgraphile(process.env.DB_URL, {
    //         watchPg: true,
    //         graphiql: true,
    //         enhanceGraphiql: true
    //     })
    // );
    
    app.use('/map', mapRouter);
    app.use('/knowledgebase', knowledgeBaseRouter);
    app.use('/forum', forumRouter);
    app.use('/tickets', ticketsRouter);
    app.use('/users', usersRouter);
    app.use('/keto', ketoRouter);
    app.use('/jobs', jobRouter);
    app.use('/tasks', taskRouter);
    app.use('/permissions', permissionsRouter);
    app.use('/app/review', reviewsAppRouter);
    app.use('/app/currency', currencyAndDiscountsRouter);
    app.use('/app/dolibarr', dolibarrRouter);
    app.use('/app/configurations', configurationsRouter);
    
    var minioClient = new Minio.Client({
        endPoint: '77.68.102.60',
        port: 9000,
        useSSL: false,
        accessKey: 'rexanthony',
        secretKey: 'rexanthony'
    });
    
    minioClient.bucketExists("test", function(error) {
        if(error) {
            return console.log(error);
        }
        let port = process.env.PORT || 1000;
        var server = app.listen(port, function() {
            console.log("Listening on port %s...", server.address().port);
        });
    });
    
    // let port = process.env.PORT || 1000;
    // var server = app.listen(port, function() {
    //     console.log("Listening on port %s...", server.address().port);
    // });
    
    // const MONGODB_URL = "mongodb://rex:anthony@localhost:27017/maptoolsdb?authSource=admin";
    // mongoose.connect(MONGODB_URL, {
    // 	useNewUrlParser: true,
    // 	useCreateIndex: true,
    // 	useUnifiedTopology: true
    // }).then(res => {
    // 	console.log('Connected to mongodb');
    // });
    
    
    // app.get("/create", async (req, res) => {
    //     let endpoint = "http://77.68.102.60:9200/user/_doc";
    //     let options =  {
    //         method: "POST",
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             firstName: "Charlie",
    //             lastName: "Chaplain"
    //         })
    //     };
    //     util.sendRequest(endpoint, options)
    //     .then(json => {    
    //         res.json(json);
    //     }).catch(err => {
    //         console.error(err);
    //         res.status(500).json({ status: 500, message: "Internal error" });
    //     });
    // });
    
    // app.get("/search", async (req, res) => {
        
    //     let endpoint = "http://77.68.102.60:9200/user/_search?q=*:*";
    //     let options =  {
    //         method: "GET"
    //     };
    //     util.sendRequest(endpoint, options)
    //     .then(json => {    
    //         res.json(json);
    //     }).catch(err => {
    //         console.error(err);
    //         res.status(500).json({ status: 500, message: "Internal error" });
    //     });
    // });
    
    app.get("/", (req, res) => {
        res.json({ 
            status: "success", 
            message: "Welcome to Nodejs Helpy Proxy | Camunda docker | minIO docker",
            endpoints: [
                "Categories"
            ]
        });
    });
    
    // app.get('/showForm', (req, res) => {
    //     res.render("test-form");
    // });
    
    app.post("/upload", Multer({storage: Multer.memoryStorage()}).single("upload"), function(request, response) {
        minioClient.putObject("test", request.file.originalname, request.file.buffer, function(error, etag) {
            if(error) {
                return console.log(error);
            }
            request.file.fileUrl = consts.LOCAL_URL+":1000/download?filename="+request.file.originalname;
            response.send(request.file);
        });
    });
    
    app.post("/uploadfile", Multer({dest: "./uploads/"}).single("upload"), function(request, response) {
        minioClient.fPutObject("test", request.file.originalname, request.file.path, "application/octet-stream", function(error, etag) {
            if(error) {
                return console.log(error);
            }
            response.send(request.file);
        });
    });
    
    app.get("/download", function(request, response) {
        minioClient.getObject("test", request.query.filename, function(error, stream) {
            if(error) {
                return response.status(500).send(error);
            }
            stream.pipe(response);
        });
    });
    
    app.delete("/deleteObject", function(request, response) {
        minioClient.removeObject("test", request.query.filename, function(error) {
            if(error) {
                return response.status(500).send(error);
            }
            response.json({ status: "success", "message": request.query.filename+" has been deleted"});
        });
    });
    
    app.use(Sentry.Handlers.errorHandler());
});