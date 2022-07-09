require("dotenv").config();
const express = require('express');
const { ApolloServer } = require("apollo-server-express");
const schema = require('./schema');
const app = express();

const server = new ApolloServer({
    schema: schema,
    uploads: false
});

server.applyMiddleware({ app });

async function main() {
    const { url } = await server.listen({ port: process.env.PORT });
    console.log(`🚀 Server ready at ${url}`);
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});