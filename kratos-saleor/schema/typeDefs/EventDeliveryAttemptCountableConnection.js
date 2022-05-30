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
const EventDeliveryAttemptCountableEdge = require("./EventDeliveryAttemptCountableEdge");

module.exports = new GraphQLObjectType({
    name: "EventDeliveryAttemptCountableConnection",
    description: "Event deliveries.",
    fields: () => ({
        pageInfo: { type: GraphQLNonNull(PageInfo) },
        edges: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(EventDeliveryAttemptCountableEdge))) },
        totalCount: { type: GraphQLInt }
    })
});