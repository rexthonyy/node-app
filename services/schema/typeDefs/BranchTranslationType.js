const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLID,
    GraphQLBoolean
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "BranchTranslationType",
    fields: () => ({
            id: { type: GraphQLNonNull(GraphQLID)},
            branch_id: { type: GraphQLID },
            locale_id: {type: GraphQLID },
            name: { type: GraphQLString },
            address: { type: GraphQLString },
            location: { type: GraphQLString },
            ref: { type: GraphQLString },
            ui_color: { type: GraphQLString },
            is_archived: { type: GraphQLBoolean },
            created_at: { type: GraphQLString },
            updated_at: { type: GraphQLString }
    })
});