const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLInt
} = require("graphql");

// data types
const PageInfo = require("./PageInfo");
const GiftCardCountableConnectionEdge = require("./GiftCardCountableConnectionEdge");

module.exports = new GraphQLObjectType({
    name: "GiftCardCountableConnection",
    description: "List of the user gift cards.",
    args: {
        before: { type: GraphQLString },
        after: { type: GraphQLString },
        first: { type: GraphQLInt },
        last: { type: GraphQLInt }
    },
    fields: () => ({
        pageInfo: { type: GraphQLNonNull(PageInfo) },
        edges: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GiftCardCountableConnectionEdge))) },
        totalCount: { type: GraphQLInt }
    })
});