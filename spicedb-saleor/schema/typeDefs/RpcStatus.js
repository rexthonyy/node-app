const {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLNonNull,
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "RpcStatus_",
    fields: () => ({
            code: { type: GraphQLInt },
            details: { type: GraphQLNonNull(GraphQLString) },
            message: { type: GraphQLString }
    })
});