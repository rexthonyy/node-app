const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "Version_",
    fields: () => ({
            version: { type: GraphQLNonNull(GraphQLString) }
    })
});