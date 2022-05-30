const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLID
} = require("graphql");

// data types
const EventDeliveryAttempt = require("./EventDeliveryAttempt");

module.exports = new GraphQLObjectType({
    name: "EventDeliveryAttemptCountableEdge",
    description: "Event deliveries.",
    fields: () => ({
            node: { type: GraphQLNonNull(EventDeliveryAttempt) },
            cursor: { type: GraphQLString }
    })
});