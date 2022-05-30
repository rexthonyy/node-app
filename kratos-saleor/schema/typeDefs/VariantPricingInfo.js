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
const TaxedMoney = require("./TaxedMoney");
const AddressInput = require("./AddressInput");

module.exports = new GraphQLObjectType({
    name: "VariantPricingInfo",
    description: "Represents availability of a variant in the storefront.",
    args: {
        addressInput: { type: AddressInput }
    },
    fields: () => ({
        onSale: { type: GraphQLBoolean },
        discount: { type: TaxedMoney },
        discountLocalCurrency: { type: TaxedMoney },
        price: { type: TaxedMoney },
        priceUndiscounted: { type: TaxedMoney },
        priceLocalCurrency: { type: TaxedMoney }
    })
});