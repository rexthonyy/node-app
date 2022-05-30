const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLID
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "GiftCardEventFilterInput",
    fields: () => ({
        type: { type: GraphQLString },
        orders: { type: GraphQLList(GraphQLNonNull(GraphQLID)) }
    })
});