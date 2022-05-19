require("dotenv").config();
const express = require('express');
const { ApolloServer } = require("apollo-server");
const { graphqlHTTP } = require('express-graphql');
const schema1 = require('./schema/index');

const app = express();

app.use(express.json());

// const server = new ApolloServer({
//   schema: schema1,
//   uploads: false
// });

// const { url } = await server.listen({port: process.env.PORT1});
// console.log(`🚀 Server ready at ${url}`);


app.use('/graphql', 
graphqlHTTP({
    schema: schema1,
    graphiql: true,
}));

let port = process.env.PORT || 1000;
var lesServer = app.listen(port, function() {
    console.log("Listening on port %s...", lesServer.address().port);
});