const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLInt
} = require("graphql");

// data types
const OrderCountableEdge = require("./OrderCountableEdge");

module.exports = new GraphQLObjectType({
    name: "OrderCountableConnection",
    description: "List of user's orders. Requires one of the following permissions: AccountPermissions.MANAGE_STAFF, AuthorizationFilters.OWNER",
    args: {
        before: { type: GraphQLString },
        after: { type: GraphQLString },
        first: { type: GraphQLInt },
        last: { type: GraphQLInt }
    },
    fields: () => ({
        pageInfo: { type: GraphQLNonNull(PageInfo) },
        edges: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(OrderCountableEdge))) },
        totalCount: { type: GraphQLInt }
    })
});