const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLBoolean
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "VerifiableAddress_",
    fields: () => ({
            id: { type: GraphQLNonNull(GraphQLString) },
            status: { type: GraphQLNonNull(GraphQLString) },
            value: { type: GraphQLNonNull(GraphQLString) },
            verified: { type: GraphQLNonNull(GraphQLBoolean) },
            verifiedAt: { type: GraphQLString },
            via: { type: GraphQLNonNull(GraphQLString) }
    })
});