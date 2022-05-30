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
    name: "ShippingMethodTranslation",
    description: "Returns translated shipping method fields for the given language code.",
    args: {
        languageCode: { type: GraphQLString }
    },
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        language: { type: GraphQLNonNull(LanguageDisplay) },
        name: { type: GraphQLString },
        description: { type: GraphQLString }
    })
});