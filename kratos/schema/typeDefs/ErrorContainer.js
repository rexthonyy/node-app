const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLJSON
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "ErrorContainer_",
    fields: () => ({
            errors: { type: GraphQLNonNull(GraphQLString), description: "Errors in the container" },
            id: { type: GraphQLNonNull(GraphQLString) }
    })
});