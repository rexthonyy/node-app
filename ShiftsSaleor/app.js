require("dotenv").config();
const express = require('express');
const { ApolloServer } = require("apollo-server-express");
const schema = require('./schema');
const app = express();

const server = new ApolloServer({ schema });

app.listen({ port: process.env.PORT }, () => {
    server.applyMiddleware({ app });
    console.log("SERVER LISTENING ON PORT " + process.env.PORT);
});