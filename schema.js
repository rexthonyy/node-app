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
            is_archived: { type: GraphQLBoolean }
    })
})
const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: 'Root Query',
    fields: () => ({
        knowledgebases: {
            type: GraphQLList(KnowledgeBaseType),
            description: "Get all knowledge bases",
            resolve: () => {
                pgQueries.listKnowledgeBases(result => {
                    if(result.err){
                        return result.err;
                    }
                    return result.res;
                });
            }
        }
    })
});


module.exports = new GraphQLSchema({
    query: RootQueryType
});