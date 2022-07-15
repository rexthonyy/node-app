require("dotenv").config();
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

let port = process.env.PORT || 1000;
var lesServer = app.listen(port, function() {
    console.log("Listening on port %s...", lesServer.address().port);
});


events.forEach(event => {
    process.on(event, () => {
        stop();
        process.exit(-1);
    });
})