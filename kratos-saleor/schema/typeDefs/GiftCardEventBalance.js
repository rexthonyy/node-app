const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLID
} = require("graphql");


// data types
const Money = require("./Money");

module.exports = new GraphQLObjectType({
    name: "GiftCardEventBalance",
    description: "The gift card balance.",
    fields: () => ({
        initialBalance: { type: Money },
        currentBalance: { type: GraphQLNonNull(Money) },
        oldInitialBalance: { type: Money },
        oldCurrentBalance: { type: Money }
    })
});