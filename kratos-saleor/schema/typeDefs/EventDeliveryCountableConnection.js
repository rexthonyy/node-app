const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLID
} = require("graphql");

// data types
const PageInfo = require("./PageInfo");
const EventDeliveryCountableEdge = require("./EventDeliveryCountableEdge");


module.exports = new GraphQLObjectType({
    name: "EventDeliveryCountableConnection",
    description: "Event deliveries.",
    fields: () => ({
        pageInfo: { type: GraphQLNonNull(PageInfo) },
        edges: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(EventDeliveryCountableEdge))) },
        totalCount: { type: GraphQLInt }
    })
});