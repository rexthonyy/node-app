require("dotenv").config();
const getLoginFlowResolver = require("./libs/getLoginFlowResolver");
const getRegistrationFlowResolver = require("./schema/resolvers/getRegistrationFlowResolver");
const executeCompleteSelfServiceLoginFlowWithPasswordMethodResolver = require('./schema/resolvers/executeCompleteSelfServiceLoginFlowWithPasswordMethodResolver');
const executeCompleteSelfServiceRegistrationFlowWithPasswordMethodResolver = require('./schema/resolvers/executeCompleteSelfServiceRegistrationFlowWithPasswordMethodResolver');

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
            req.session.callbackUrl = req.query.callbackUrl;
            if (!req.session.callbackUrl) {
                return res.send("Please provide a callbackUrl");
            }

            getLoginFlowResolver({ refresh: true }, loginFlow => {
                console.log(loginFlow)
                if (loginflow == null) return res.send("Error: failed to create login flow");
                // req.session.loginflow = loginflow;
                // console.log(req.session.loginFlow.id);

                res.render('login');
            });
        });

        app.post('/login', utils.isAuthenticated, (req, res) => {
            let email = req.body.email;
            let password = req.body.password;
            console.log(req.session);
            executeCompleteSelfServiceLoginFlowWithPasswordMethodResolver(null, {
                completeSelfServiceLoginFlowWithPasswordMethodInput: {
                    identifier: email,
                    password: password
                },
                flow: req.session.loginFlow.id
            }).then(appSession => {
                if (appSession == null) return res.send("Error: failed to create session");
                let sessionToken = appSession.sessionToken;
                res.redirect(`${process.env.callbackUrl}?sessionToken=${sessionToken}`);
            }).catch(err => {
                res.send("Error: failed to create session");
            });
        });

        app.get('/signup', utils.isAuthenticated, (req, res) => {
            if (!req.session.callbackUrl) {
                return res.send("Please provide a callback url");
            }

            getRegistrationFlowResolver()
                .then(registrationFlow => {
                    if (registrationFlow == null) return res.send("Error: failed to create registration flow");
                    req.session.registrationFlow = registrationFlow;
                    res.render('signup');
                }).catch(err => {
                    console.log(err);
                    res.send("Error: failed to create registration flow");
                });
        });

        app.post('/signup', utils.isAuthenticated, (req, res) => {
            let firstName = req.body.firstName;
            let lastName = req.body.lastName;
            let email = req.body.email;
            let password = req.body.password;

            executeCompleteSelfServiceRegistrationFlowWithPasswordMethodResolver(null, {
                flow: req.session.registrationFlow.id,
                selfServiceRegistrationMethodsPasswordInput: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password
                })
            }).then(session => {
                if (session == null) return res.send("Error: failed to create session");
                let sessionToken = session.sessionToken;
                res.redirect(`${process.env.callbackUrl}?sessionToken=${sessionToken}`);
            }).catch(err => {
                console.log(err);
                res.send("Error: failed to create session");
            });
        });

        app.use(Sentry.Handlers.errorHandler());
    });