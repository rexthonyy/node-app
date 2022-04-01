const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLBoolean
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "Knowledgebase",
    description: "Knowledgebases are used to store categories, subcategories and articles, seperated by levels with the max level at 5",
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