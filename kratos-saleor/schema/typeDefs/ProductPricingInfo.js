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
const TaxedMoney = require("./TaxedMoney");
const TaxedMoneyRange = require("./TaxedMoneyRange");

module.exports = new GraphQLObjectType({
    name: "ProductPricingInfo",
    description: "Lists the storefront product's pricing, the current price and discounts, only meant for displaying.",
    fields: () => ({
        onSale: { type: GraphQLBoolean },
        discount: { type: TaxedMoney },
        discountLocalCurrency: { type: TaxedMoney },
        priceRange: { type: TaxedMoneyRange },
        priceRangeUndiscounted: { type: TaxedMoneyRange },
        priceRangeLocalCurrency: { type: TaxedMoneyRange }
    })
});