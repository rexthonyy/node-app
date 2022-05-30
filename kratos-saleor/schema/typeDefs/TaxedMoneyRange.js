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

module.exports = new GraphQLObjectType({
    name: "TaxedMoneyRange",
    description: "The discounted price range of the product variants.",
    fields: () => ({
        start: { type: TaxedMoney },
        stop: { type: TaxedMoney }
    })
});