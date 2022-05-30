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

const ProductCountableEdge = require("./ProductCountableEdge");

module.exports = new GraphQLObjectType({
    name: "ProductCountableConnection",
    description: "List of excluded products for the shipping method. Requires one of the following permissions: MANAGE_SHIPPING.",
    args: {
        before: { type: GraphQLString },
        after: { type: GraphQLString },
        first: { type: GraphQLInt },
        last: { type: GraphQLInt }
    },
    fields: () => ({
        pageInfo: { type: GraphQLNonNull(PageInfo) },
        edges: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(ProductCountableEdge))) },
        totalCount: { type: GraphQLInt }
    })
});