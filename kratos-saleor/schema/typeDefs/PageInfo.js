const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLID
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "PageInfo",
    description: "The Relay compliant PageInfo type, containing data necessary to paginate this connection.",
    fields: () => ({
            hasNextPage: { type: GraphQLBoolean },
            hasPreviousPage: { type: GraphQLBoolean },
            startCursor: { type: GraphQLString },
            endCursor: { type: GraphQLString }
    })
});