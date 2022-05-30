const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLID
} = require("graphql");


// data types
const MetadataItem = require("./MetadataItem");
const CollectionChannelListing = require("./CollectionChannelListing");
const CollectionTranslation = require("./CollectionTranslation");
const Image = require("./Image");
const ProductCountableConnection = require("./ProductCountableConnection");
const LanguageDisplay = require("./LanguageDisplay");

module.exports = new GraphQLObjectType({
    name: "CollectionTranslation",
    description: "Returns translated collection fields for the given language code.",
    args: {
        languageCode: { type: GraphQLString }
    },
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        language: { type: GraphQLNonNull(LanguageDisplay) },
        seoTitle: { type: GraphQLString },
        seoDescription: { type: GraphQLString },
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        descriptionJSON: { type: GraphQLString }
    })
});