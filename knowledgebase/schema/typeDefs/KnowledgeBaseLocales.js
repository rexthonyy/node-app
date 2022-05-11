const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "KnowledgeBaseLocales",
    description: "A locale",
    fields: () => ({
            id: { type: GraphQLID },
            locale: { type: GraphQLString },
            name: { type: GraphQLString }
    })
});