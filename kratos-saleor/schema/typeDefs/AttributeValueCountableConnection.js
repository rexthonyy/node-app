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
const AttributeChoicesSortingInput = require("./AttributeChoicesSortingInput");
const AttributeValueFilterInput = require("./AttributeValueFilterInput");
const AttributeValueCountableEdge = require("./AttributeValueCountableEdge");

module.exports = new GraphQLObjectType({
    name: "AttributeValueCountableConnection",
    description: "List of attribute's values.",
    args: {
        sortBy: { type: AttributeChoicesSortingInput },
        filter: { type: AttributeValueFilterInput },
        before: { type: GraphQLString },
        after: { type: GraphQLString },
        first: { type: GraphQLInt },
        last: { type: GraphQLInt }
    },
    fields: () => ({
        pageInfo: { type: GraphQLNonNull(PageInfo) },
        edges: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(AttributeValueCountableEdge))) },
        totalCount: { type: GraphQLInt }
    })
});