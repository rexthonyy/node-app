require("dotenv").config();
require('./postgres/initialize_dbs').init()
    .then(() => {
        const Sentry = require("@sentry/node");
        Sentry.init({ dsn: "http://d78601a2198e422d8855c8be53f57061@88.208.212.249:8000/2" });
        const cors = require('cors');
        const express = require('express');
        const session = require('express-session');
        const cookieParser = require('cookie-parser');
        const passport = require('passport');
        const { graphqlHTTP } = require('express-graphql');
        const { applyMiddleware } = require('graphql-middleware');
        const utils = require('./libs/util');
        const middleware = require('./libs/middleware');
        const schema = require('./schema');
        const schemaWithMiddleware = applyMiddleware(schema, middleware)
        const app = express();

        app.set('view engine', 'ejs');

        app.use(express.static('public'));
        app.use(session({ secret: process.env.SESSION_SECRET }));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());
        app.use(cors());

        app.use(cookieParser());
        app.use(session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false
        }));
        app.use(Sentry.Handlers.requestHandler());

        app.use('/graphql',
            graphqlHTTP(req => ({
                schema: schemaWithMiddleware,
                graphiql: true,
                context: req
            })));

        let port = process.env.PORT || 1000;
        var lesServer = app.listen(port, function() {
            console.log("Listening on port %s...", lesServer.address().port);
        });

        app.get('/login', utils.isAuthenticated, (req, res) => {
            let callbackUrl = req.query.callbackUrl;
            if (!callbackUrl) {
                return res.send("Please provide a callbackUrl");
            }
            req.session.callbackUrl = callbackUrl;

            res.render('login', { callbackUrl });
            /*
            getLoginFlowResolver(null, { refresh: true })
                .then(loginflow => {
                    if (loginflow == null) return res.send("Error: failed to create login flow");
                    req.session.loginflow = loginflow;
                    res.render('login', { callbackUrl });
                }).catch(err => {
                    console.error(err);
                    res.send("Error: failed to create login flow");
                });
                */
        });

        app.post('/login', utils.isAuthenticated, (req, res) => {
            let email = req.body.email;
            let password = req.body.password;
            res.redirect(`${req.session.callbackUrl}?accessToken=${1}&refreshToken=${2}`);
            /*
            executeCompleteSelfServiceLoginFlowWithPasswordMethodResolver(null, {
                completeSelfServiceLoginFlowWithPasswordMethodInput: {
                    identifier: email,
                    password: password
                },
                flow: req.session.loginflow.id
            }).then(appSession => {
                if (appSession == null) return res.send("Error: failed to create session");
                let sessionToken = appSession.sessionToken;
                res.redirect(`${req.session.callbackUrl}?sessionToken=${sessionToken}`);
            }).catch(err => {
                console.log(err);
                res.send("Error: failed to create session");
            });
            */
        });

        app.get('/signup', utils.isAuthenticated, (req, res) => {
            let callbackUrl = req.query.callbackUrl;
            if (!callbackUrl) {
                return res.send("Please provide a callbackUrl");
            }
            req.session.callbackUrl = callbackUrl;
            res.render('signup', { callbackUrl });
            /*
                        getRegistrationFlowResolver()
                            .then(registrationFlow => {
                                if (registrationFlow == null) return res.send("Error: failed to create registration flow");
                                req.session.registrationFlow = registrationFlow;
                                res.render('signup', { callbackUrl });
                            }).catch(err => {
                                console.log(err);
                                res.send("Error: failed to create registration flow");
                            });
                            */
        });

        app.post('/signup', utils.isAuthenticated, (req, res) => {
            let firstName = req.body.firstName;
            let lastName = req.body.lastName;
            let email = req.body.email;
            let password = req.body.password;

            res.redirect(`${req.session.callbackUrl}?accessToken=${1}&refreshToken=${2}`);
            /*
            executeCompleteSelfServiceRegistrationFlowWithPasswordMethodResolver(null, {
                flow: req.session.registrationFlow.id,
                selfServiceRegistrationMethodsPasswordInput: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password
                })
            }).then(appSession => {
                if (appSession == null) return res.send("Error: failed to create session");
                let sessionToken = appSession.sessionToken;
                res.redirect(`${req.session.callbackUrl}?sessionToken=${sessionToken}`);
            }).catch(err => {
                console.log(err);
                res.send("Error: failed to create session");
            });
            */
        });

        app.use(Sentry.Handlers.errorHandler());
    });