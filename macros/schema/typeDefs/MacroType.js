const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLID,
    GraphQLNonNull,
    GraphQLList
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "MacroType",
    description: "An object that represents a macro",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLNonNull(GraphQLString) },
        group_ids: { type: GraphQLList(GraphQLID) },
        perform: { type: GraphQLString },
        active: { type: GraphQLNonNull(GraphQLBoolean) },
        ux_flow_next_up: { type: GraphQLString },
        note: { type: GraphQLString },
        updated_by_id: { type: GraphQLID },
        created_by_id: { type: GraphQLID },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString }
    })
});