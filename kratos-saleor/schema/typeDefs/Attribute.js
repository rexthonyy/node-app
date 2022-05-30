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
const MetadataItem = require("./MetadataItem");
const AttributeValueCountableConnection = require("./AttributeValueCountableConnection");
const ProductTypeCountableConnection = require("./ProductTypeCountableConnection");
const AttributeTranslation = require("./AttributeTranslation");

module.exports = new GraphQLObjectType({
    name: "Attribute",
    description: "Custom attribute of a product. Attributes can be assigned to products and variants at the product type level.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        privateMetadata: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MetadataItem))) },
        privateMetaField: { type: GraphQLString },
        privateMetaFields: { type: GraphQLString },
        metadata: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MetadataItem))) },
        metafield: { type: GraphQLString },
        metafields: { type: GraphQLString },
        inputType: { type: GraphQLString },
        entityType: { type: GraphQLString },
        name: { type: GraphQLString },
        slug: { type: GraphQLString },
        type: { type: GraphQLString },
        unit: { type: GraphQLString },
        choices: { type: AttributeValueCountableConnection },
        valueRequired: { type: GraphQLNonNull(GraphQLBoolean) },
        visibleInStorefront: { type: GraphQLNonNull(GraphQLBoolean) },
        filterableInStorefront: { type: GraphQLNonNull(GraphQLBoolean) },
        filterableInDashboard: { type: GraphQLNonNull(GraphQLBoolean) },
        availableInGrid: { type: GraphQLNonNull(GraphQLBoolean) },
        storefrontSearchPosition: { type: GraphQLNonNull(GraphQLInt) },
        translation: { type: AttributeTranslation },
        withChoices: { type: GraphQLNonNull(GraphQLBoolean) },
        productTypes: { type: GraphQLNonNull(ProductTypeCountableConnection) },
        productVariantTypes: { type: GraphQLNonNull(ProductTypeCountableConnection) },
    })
});