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
const ProductType = require("./ProductType");
const Category = require("./Category");
const Weight = require("./Weight");
const ProductVariant = require("./ProductVariant");
const Channel = require("./Channel");
const ProductPricingInfo = require("./ProductPricingInfo");
const TaxType = require("./TaxType");
const SelectedAttribute = require("./SelectedAttribute");
const ProductChannelListing = require("./ProductChannelListing");
const ProductMedia = require("./ProductMedia");
const Collection = require("./Collection");
const ProductTranslation = require("./ProductTranslation");
const ProductImage = require("./ProductImage");
const Image = require("./Image");
const LanguageDisplay = require("./LanguageDisplay");

module.exports = new GraphQLObjectType({
    name: "ProductTranslation",
    description: "Returns translated product fields for the given language code.",
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