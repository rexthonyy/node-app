const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLID
} = require("graphql");

// data types
const GiftCard = require("./GiftCard");

module.exports = new GraphQLObjectType({
    name: "GiftCardCountableConnectionEdge",
    fields: () => ({
            node: { type: GraphQLNonNull(GiftCard) },
            cursor: { type: GraphQLString }
    })
});