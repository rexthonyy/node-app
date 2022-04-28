const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "ErrorContainer_",
    fields: () => ({
            errors: { type: GraphQLNonNull(GraphQLList(GraphQLString)), description: "Errors in the container" },
            id: { type: GraphQLNonNull(GraphQLString) }
    })
});