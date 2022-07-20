require("dotenv").config();
const Sentry = require("@sentry/node");
Sentry.init({ dsn: "http://735995b162b54d169b08731617273be9@88.208.212.249:8000/7" });
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { applyMiddleware } = require('graphql-middleware');
const middleware = require('./libs/middleware');
const { stop } = require('./postgres');
const { events } = require("./libs/consts");
const schema = require('./schema');
const schemaWithMiddleware = applyMiddleware(schema, middleware)
const app = express();

app.use(express.static('public'));

app.use('/graphql',
    graphqlHTTP(req => ({
        schema: schemaWithMiddleware,
        graphiql: true,
        context: req
    })));

app.use(Sentry.Handlers.requestHandler());

let port = process.env.PORT || 1000;
var lesServer = app.listen(port, function() {
    console.log("Listening on port %s...", lesServer.address().port);
});

events.forEach(event => {
    process.on(event, async() => {
        await stop();
        process.exit(-1);
    });
})

app.use(Sentry.Handlers.errorHandler());