const {
    GraphQLSchema
} = require("graphql");

const RootQueryType = require("./typeDefs/RootQueryType");
const RootMutationType = require("./typeDefs/RootMutationType");

module.exports = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
});