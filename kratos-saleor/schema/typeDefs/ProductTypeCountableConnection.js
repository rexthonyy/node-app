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
const PageInfo = require("./PageInfo");
const ProductTypeCountableEdge = require("./ProductTypeCountableEdge");


module.exports = new GraphQLObjectType({
    name: "ProductTypeCountableConnection",
    args: {
        before: { type: GraphQLString },
        after: { type: GraphQLString },
        first: { type: GraphQLInt },
        last: { type: GraphQLInt }
    },
    fields: () => ({
        pageInfo: { type: GraphQLNonNull(PageInfo) },
        edges: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(ProductTypeCountableEdge))) },
        totalCount: { type: GraphQLInt }
    })
});