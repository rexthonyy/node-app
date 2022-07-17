require("dotenv").config();
const { ApolloServer } = require("apollo-server-express");
const {
    GraphQLUpload,
    graphqlUploadExpress, // A Koa implementation is also exported.
} = require('graphql-upload');
const express = require('express');
const schema = require('./schema');

const app = express();
const server = new ApolloServer(schema);

// This middleware should be added before calling `applyMiddleware`.
app.use(graphqlUploadExpress());
app.use(express.urlencoded({ extended: true }));
server.applyMiddleware({ app });
app.use(express.static('public'));


app.listen({ port: process.env.PORT }, () => {
    console.log("SERVER LISTENING ON PORT " + process.env.PORT);
});