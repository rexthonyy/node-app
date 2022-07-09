const { gql } = require("apollo-server-express");
const { join } = require('path');
const fs = require('fs');

const file = fs.readFileSync(join(__dirname, './schema.graphql'), 'utf8');

console.log(file);

const typeDefs = gql `${file}`;

module.exports = { typeDefs };