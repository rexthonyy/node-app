const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLJSON
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "ErrorContainer",
    fields: () => ({
            errors: { type: GraphQLNonNull(GraphQLJSON), description: "Errors in the container" },
            id: { type: GraphQLNonNull(GraphQLString) }
    })
});