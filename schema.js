const pgQueries = require('./postgres/kb-queries');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLBoolean
} = require("graphql");

const KnowledgeBaseType = new GraphQLObjectType({
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
})
const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: 'Root Query',
    fields: () => ({
        knowledgebases: {
            type: KnowledgeBaseType,
            description: "Get all knowledge bases",
            resolve: () => {
                // pgQueries.listKnowledgeBases(result => {
                //     if(result.err){
                //         return result.err;
                //     }
                //     return result.res;
                // });
                return {
                    id: 1,
                    name: "knowledgebase x",
                    icon: "icon",
                    footer: "some",
                    created_at: "382",
                    homepage_layout: "best",
                    category_layout: "chat",
                    active: true,
                    updated_at: "382",
                    front_page: "lss",
                    position: 21,
                    ui_color: "blue",
                    is_archived: false
                };
            }
        }
    })
});


module.exports = new GraphQLSchema({
    query: RootQueryType
});