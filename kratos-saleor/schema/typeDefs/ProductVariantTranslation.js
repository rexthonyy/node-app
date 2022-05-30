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


// data types
const LanguageDisplay = require("./LanguageDisplay");

module.exports = new GraphQLObjectType({
    name: "ProductVariantTranslation",
    args: {
        languageCode: { type: GraphQLString }
    },
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        language: { type: GraphQLNonNull(LanguageDisplay) },
        name: { type: GraphQLNonNull(GraphQLString) }
    })
});