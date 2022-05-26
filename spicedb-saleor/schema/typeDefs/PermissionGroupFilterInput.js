const {
    GraphQLString,
    GraphQLList,
    GraphQLInputObjectType,
    GraphQLID,
} = require("graphql");

module.exports = new GraphQLInputObjectType({
    name: "PermissionGroupFilterInput",
    description: "Filtering options for permission groups.",
    fields: () => ({
        search: { type: GraphQLString },
        ids: { type: GraphQLList(GraphQLID) }
    })
});