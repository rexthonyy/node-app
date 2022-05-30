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
const AssignedVariantAttribute = require("./AssignedVariantAttribute");
const Attribute = require("./Attribute");
const Weight = require("./Weight");
const AttributeCountableConnection = require("./AttributeCountableConnection");
const ProductCountableConnection = require("./ProductCountableConnection");
const TaxType = require("./TaxType");

module.exports = new GraphQLObjectType({
    name: "ProductType",
    description: "Represents a type of product. It defines what attributes are available to products of this type.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        privateMetadata: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MetadataItem))) },
        privateMetaField: { type: GraphQLString },
        privateMetaFields: { type: GraphQLString },
        metadata: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MetadataItem))) },
        metafield: { type: GraphQLString },
        metafields: { type: GraphQLString },
        name: { type: GraphQLString },
        slug: { type: GraphQLString },
        hasVariants: { type: GraphQLBoolean },
        isShippingRequired: { type: GraphQLNonNull(GraphQLBoolean) },
        isDigital: { type: GraphQLNonNull(GraphQLBoolean) },
        weight: { type: Weight },
        kind: { type: GraphQLString },
        taxType: { type: TaxType },
        assignedVariantAttributes: { type: GraphQLList(GraphQLNonNull(AssignedVariantAttribute)) },
        productAttributes: { type: GraphQLList(GraphQLNonNull(Attribute)) },
        availableAttributes: { type: AttributeCountableConnection },
        products: { type: ProductCountableConnection },
        variantAttributes: { type: GraphQLList(GraphQLNonNull(Attribute)) }
    })
});