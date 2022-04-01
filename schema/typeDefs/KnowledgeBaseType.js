const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLBoolean
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "Knowledgebase",
    description: "App databases",
    fields: () => ({
            id: { type: GraphQLNonNull(GraphQLInt)},
            name: { type: GraphQLString },
            icon: { type: GraphQLString },
            footer: { type: GraphQLString },
            created_at: { type: GraphQLString },
            homepage_layout: { type: GraphQLString },
            category_layout: { type: GraphQLString },
            active: { type: GraphQLBoolean },
            updated_at: { type: GraphQLString },
            front_page: { type: GraphQLString },
            position: { type: GraphQLInt },
            ui_color: { type: GraphQLString },
            is_archived: { type: GraphQLBoolean }
    })
});