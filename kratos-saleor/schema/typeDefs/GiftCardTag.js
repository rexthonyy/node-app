const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLID
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "GiftCardTag",
    description: "Added in Saleor 3.1. The gift card tag. Note: this feature is in a preview state and can be subject to changes at later point. Requires one of the following permissions: MANAGE_GIFT_CARD.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLNonNull(GraphQLString) }
    })
});