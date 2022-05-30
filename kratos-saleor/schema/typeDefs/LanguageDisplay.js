const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLID,
    GraphQLInt
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "LanguageDisplay",
    fields: () => ({
        code: { type: GraphQLNonNull(GraphQLString) },
        language: { type: GraphQLNonNull(GraphQLString) }
    })
});