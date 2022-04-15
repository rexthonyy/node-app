const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLNonNull,
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "MacroActionType",
    description: "An object that represents a macro action",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLNonNull(GraphQLString) },
        fields: { type: GraphQLString },
        created_by_id: { type: GraphQLID },
        updated_by_id: { type: GraphQLID },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString }
    })
});