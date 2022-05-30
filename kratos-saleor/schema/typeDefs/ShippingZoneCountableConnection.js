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
const ShippingZoneCountableEdge = require("./ShippingZoneCountableEdge");

module.exports = new GraphQLObjectType({
    name: "ShippingZoneCountableConnection",
    args: {
        before: { type: GraphQLString },
        after: { type: GraphQLString },
        first: { type: GraphQLInt },
        last: { type: GraphQLInt }
    },
    fields: () => ({
        pageInfo: { type: GraphQLNonNull(PageInfo) },
        edges: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(ShippingZoneCountableEdge))) },
        totalCount: { type: GraphQLInt }
    })
});