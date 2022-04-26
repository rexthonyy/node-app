const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLBoolean
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "RecoveryAddress_",
    fields: () => ({
            id: { type: GraphQLNonNull(GraphQLString) },
            value: { type: GraphQLNonNull(GraphQLString) },
            via: { type: GraphQLNonNull(GraphQLString) }
    })
});