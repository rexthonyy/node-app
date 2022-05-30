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
const AddressInput = require("./AddressInput");
const Warehouse = require("./Warehouse");
const ProductVariant = require("./ProductVariant");

module.exports = new GraphQLObjectType({
    name: "Stock",
    description: "Stocks for the product variant. Requires one of the following permissions: MANAGE_PRODUCTS, MANAGE_ORDERS.",
    args: {
        address: { type: AddressInput },
        countryCode: { type: GraphQLString }
    },
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        warehouse: { type: GraphQLNonNull(Warehouse) },
        productVariant: { type: GraphQLNonNull(ProductVariant) },
        quantity: { type: GraphQLNonNull(GraphQLInt) },
        quantityAllocated: { type: GraphQLNonNull(GraphQLInt) },
        quantityReserved: { type: GraphQLNonNull(GraphQLInt) }
    })
});