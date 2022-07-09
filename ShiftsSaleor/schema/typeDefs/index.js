const { gql } = require("apollo-server-express");
const fs = require('fs');

const file = fs.readFileSync('./schema.graphql', 'utf8');

console.log(file);

const typeDefs = gql `${file}`;

module.exports = { typeDefs };