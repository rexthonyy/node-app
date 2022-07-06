require("dotenv").config();
const express = require('express');
const { ApolloServer } = require("apollo-server");
const { graphqlHTTP } = require('express-graphql');
const { applyMiddleware } = require('graphql-middleware');
const middleware = require('./libs/middleware');
const schema = require('./schema');
const schemaWithMiddleware = applyMiddleware(schema, middleware)
const app = express();

// app.use('/graphql',
//     graphqlHTTP(req => ({
//         schema: schemaWithMiddleware,
//         graphiql: true,
//         context: req
//     })));

// let port = process.env.PORT || 1000;
// var lesServer = app.listen(port, function() {
//     console.log("Listening on port %s...", lesServer.address().port);
// });

const server = new ApolloServer({
    schema: schema,
    uploads: false
});

const { url } = await server.listen({ port: process.env.PORT });
console.log(`🚀 Server ready at ${url}`);