require("dotenv").config();
const { ApolloServer } = require("apollo-server-express");
const express = require('express');
const schema = require('./schema');

const app = express();
const server = new ApolloServer({ schema });

server.applyMiddleware({ app });

app.listen({ port: process.env.PORT }, () => {
    console.log("SERVER LISTENING ON PORT " + process.env.PORT);
});