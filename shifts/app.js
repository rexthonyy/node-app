require("dotenv").config();
const Sentry = require("@sentry/node");
Sentry.init({ dsn: "http://5ce1738f14234024b58b150229df7a36@88.208.212.249:8000/6" });
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { applyMiddleware } = require('graphql-middleware');
const middleware = require('./libs/middleware');
const { stop } = require('./postgres');
const { events } = require("./libs/consts");
const schema = require('./schema');
const schemaWithMiddleware = applyMiddleware(schema, middleware)
const app = express();

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