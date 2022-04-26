const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList
} = require("graphql");

// data types
const Identity = require("./Identity");

module.exports = new GraphQLObjectType({
    name: "Session_",
    fields: () => ({
            active: { type: GraphQLBoolean },
            authenticatedAt: { type: GraphQLNonNull(GraphQLString) },
            expiresAt: { type: GraphQLNonNull(GraphQLString) },
            id: { type: GraphQLNonNull(GraphQLString) },
            identity: { type: GraphQLNonNull(Identity) },
            issuedAt: { type: GraphQLNonNull(GraphQLString) }
    })
});