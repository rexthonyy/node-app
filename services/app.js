require("dotenv").config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema1 = require('./schema/index');

const app = express();

app.use(express.json());

app.use('/graphql', 
graphqlHTTP({
    schema: schema1,
    graphiql: true,
}));

let port = process.env.PORT || 1000;
var lesServer = app.listen(port, function() {
    console.log("Listening on port %s...", lesServer.address().port);
});