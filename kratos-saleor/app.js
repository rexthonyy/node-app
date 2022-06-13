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
        const jwt = require('jsonwebtoken');
        const pgKratosQueries = require('./postgres/kratos-queries');
        const utils = require('./libs/util');
        const s3Handler = require('./libs/s3Handler');
        const middleware = require('./libs/middleware');
        const userAvatarUpdate = require('./schema/resolvers/userAvatarUpdate');
        const tokenCreate = require('./schema/resolvers/tokenCreate');
        const tokenVerify = require('./schema/resolvers/tokenVerify');
        const accountRegister = require('./schema/resolvers/accountRegister');
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
        //app.use(cors());

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

        //use by upload form
        app.post('/uploadUserAvatar', s3Handler.upload.array('upload', 25), function(req, res, next) {
            let result = middleware(userAvatarUpdate, null, null, req, null);
            res.send(result);
        });

        app.get('/login', utils.isAuthenticated, (req, res) => {
            let callbackUrl = req.query.callbackUrl;
            if (!callbackUrl) return res.send("Please provide a callbackUrl");

            req.session.callbackUrl = callbackUrl;

            if (req.session.isAuthenticated) return generateOutput(req);

            res.render('login', { callbackUrl });
        });

        app.post('/login', utils.isAuthenticated, async(req, res) => {
            if (!req.session.callbackUrl) return res.redirect("login");
            if (req.session.isAuthenticated) return generateOutput(req);

            let email = req.body.email;
            let password = req.body.password;

            let result = await tokenCreate(null, { email, password }, null);
            if (result.token == null) return res.send(result.errors);

            res.redirect(`${req.session.callbackUrl}?accessToken=${result.token}&refreshToken=${result.refreshToken}&csrfToken=${result.csrfToken}`);
        });

        app.get('/signup', utils.isAuthenticated, (req, res) => {
            let callbackUrl = req.query.callbackUrl;
            if (!callbackUrl) return res.send("Please provide a callbackUrl");
            req.session.callbackUrl = callbackUrl;
            if (req.session.isAuthenticated) return generateOutput(req);

            res.render('signup', { callbackUrl });
        });

        app.post('/signup', utils.isAuthenticated, async(req, res) => {
            if (!req.session.callbackUrl) return res.redirect("signup");
            if (req.session.isAuthenticated) return generateOutput(req);

            let firstName = req.body.firstName;
            let lastName = req.body.lastName;
            let email = req.body.email;
            let password = req.body.password;
            let languageCode = "EN";


            let result = await accountRegister(null, {
                input: {
                    firstName,
                    lastName,
                    email,
                    password,
                    languageCode
                }
            }, null);

            if (!result.user) return res.send(result.errors);

            let { token, refreshToken, csrfToken } = await getUserTokens(result.user);

            res.cookie(process.env.COOKIE_ID, token, { maxAge: 1000 * 60 * 60 * 1, httponly: true });

            res.redirect(`${req.session.callbackUrl}?accessToken=${token}&refreshToken=${refreshToken}&csrfToken=${csrfToken}`);
        });

        async function generateOutput(req) {
            const inputToken = req.cookies[process.env.COOKIE_ID];
            let result = await tokenVerify(null, { inputToken }, null);
            if (!result.isValid) return req.send("Token is invalid");
            let { token, refreshToken, csrfToken } = await getUserTokens(result.user);
            res.redirect(`${req.session.callbackUrl}?accessToken=${token}&refreshToken=${refreshToken}&csrfToken=${csrfToken}`);
        }

        function getUserTokens(user) {
            return new Promise(resolve => {
                pgKratosQueries.getUserByEmail([user.email], async result => {
                    let accountUser = result.res[0];
                    user = {
                        user_id: accountUser.id,
                        email: accountUser.email
                    };

                    let userToken = jwt.sign(user, accountUser.jwt_token_key);
                    let confirmationData = {
                        data: userToken
                    };

                    let accessToken = jwt.sign(confirmationData, process.env.ACCESS_TOKEN_SECRET, { subject: accountUser.id + "", expiresIn: process.env.JWT_TTL_ACCESS });
                    let refreshToken = jwt.sign(confirmationData, process.env.REFRESH_TOKEN_SECRET, { subject: accountUser.id + "", expiresIn: process.env.JWT_TTL_REFRESH });
                    let csrfToken = jwt.sign(confirmationData, process.env.CSRF_TOKEN_SECRET, { subject: accountUser.id + "", expiresIn: process.env.JWT_TTL_REFRESH });

                    resolve({ accessToken, refreshToken, csrfToken });
                });
            });
        }
        app.use(Sentry.Handlers.errorHandler());
    });