require("dotenv").config();
const { ApolloServer } = require("apollo-server-express");
const { graphqlUploadExpress } = require('graphql-upload');
const express = require('express');
const schema = require('./schema');

async function startServer() {
    const server = new ApolloServer(schema);
    await server.start();
    const app = express();
    // This middleware should be added before calling `applyMiddleware`.
    app.use(graphqlUploadExpress());
    server.applyMiddleware({ app });
    app.use(express.static('public'));
    //app.use(express.urlencoded({ extended: true }));
    app.listen({ port: process.env.PORT }, () => {
        console.log("SERVER LISTENING ON PORT " + process.env.PORT);
    });
}
startServer();