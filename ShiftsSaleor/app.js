require("dotenv").config();
const { ApolloServer } = require("apollo-server-express");
const { graphqlUploadExpress } = require("graphql-upload");
const express = require('express');
const schema = require('./schema');

const app = express();
const server = new ApolloServer(schema);

app.use(graphqlUploadExpress());

server.applyMiddleware({ app });

app.listen({ port: process.env.PORT }, () => {
    console.log("SERVER LISTENING ON PORT " + process.env.PORT);
});