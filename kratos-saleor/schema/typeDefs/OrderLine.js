const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLInt,
    GraphQLID,
    GraphQLFloat
} = require("graphql");

// data types
const Image = require("./Image");
const ProductVariant = require("./ProductVariant");
const TaxedMoney = require("./TaxedMoney");
const DigitalContentUrl = require("./DigitalContentUrl");
const Allocation = require("./Allocation");

module.exports = new GraphQLObjectType({
    name: "OrderLine",
    description: "Represents order line of particular order.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        productName: { type: GraphQLNonNull(GraphQLString) },
        variantName: { type: GraphQLNonNull(GraphQLString) },
        productSku: { type: GraphQLString },
        productVariantId: { type: GraphQLString },
        isShippingRequired: { type: GraphQLNonNull(GraphQLBoolean) },
        quantity: { type: GraphQLNonNull(GraphQLInt) },
        quantityFulfilled: { type: GraphQLNonNull(GraphQLInt) },
        unitDiscountReason: { type: GraphQLString },
        taxRate: { type: GraphQLNonNull(GraphQLFloat) },
        digitalContentUrl: { type: DigitalContentUrl },
        thumbnail: { type: Image },
        unitPrice: { type: GraphQLNonNull(TaxedMoney) },
        undiscountedUnitPrice: { type: GraphQLNonNull(TaxedMoney) },
        unitDiscount: { type: GraphQLNonNull(TaxedMoney) },
        unitDiscountValue: { type: GraphQLNonNull(GraphQLFloat) },
        totalPrice: { type: GraphQLNonNull(TaxedMoney) },
        variant: { type: ProductVariant },
        translatedProductName: { type: GraphQLNonNull(GraphQLString) },
        translatedVariantName: { type: GraphQLNonNull(GraphQLString) },
        allocations: { type: GraphQLList(GraphQLNonNull(Allocation)) },
        quantityToFulfill: { type: GraphQLNonNull(GraphQLInt) },
        unitDiscountType: { type: GraphQLString },
    })
});