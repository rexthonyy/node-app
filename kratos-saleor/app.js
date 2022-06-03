require("dotenv").config();
require('./postgres/initialize_dbs').init()
    .then(async() => {
        const Sentry = require("@sentry/node");
        Sentry.init({ dsn: "http://d78601a2198e422d8855c8be53f57061@88.208.212.249:8000/2" });
        const express = require('express');
        const session = require('express-session');
        const cookieParser = require('cookie-parser');
        const passport = require('passport');
        const { graphqlHTTP } = require('express-graphql');
        //const schema1 = require('./schema/index');
        const { loadSchemaSync } = require('@graphql-tools/load');
        const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');
        const utils = require('./libs/util');
        const schema = loadSchemaSync("schema.graphql", {
            loaders: [new GraphQLFileLoader()]
        });

        const app = express();

        app.set('view engine', 'ejs');

        app.use(express.static('public'));
        app.use(session({ secret: process.env.SESSION_SECRET }));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());
        app.use(cookieParser());
        app.use(session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false
        }));
        app.use(Sentry.Handlers.requestHandler());

        app.use('/graphql',
            graphqlHTTP({
                schema,
                graphiql: true,
            }));

        let port = process.env.PORT || 1000;
        var lesServer = app.listen(port, function() {
            console.log("Listening on port %s...", lesServer.address().port);
        });

        app.get('/login', utils.isAuthenticated, (req, res) => {
            let callbackUrl = req.query.callbackUrl;
            if (req.kratosSession != null) {

            }
            res.render('login');
        });

        app.post('/login', utils.isAuthenticated, (req, res) => {
            let email = req.body.email;
            let password = req.body.password;

            console.log(email);
            console.log(password);
        });

        app.get('/signup', utils.isAuthenticated, (req, res) => {
            let callbackUrl = req.query.callbackUrl;
            if (req.kratosSession != null) {

            }
            res.render('signup');
        });

        app.post('/signup', utils.isAuthenticated, (req, res) => {
            let email = req.body.email;
            let password = req.body.password;

            console.log(email);
            console.log(password);
        });

        app.use(Sentry.Handlers.errorHandler());
    });