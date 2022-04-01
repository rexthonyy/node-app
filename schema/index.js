const {
    GraphQLSchema
} = require("graphql");

const RootQueryType = require("./typeDefs/RootQueryType");

module.exports = new GraphQLSchema({
    query: RootQueryType
});