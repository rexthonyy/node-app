const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLID
} = require("graphql");

// data types
const EventDeliveryAttemptCountableConnection = require("./EventDeliveryAttemptCountableConnection");


module.exports = new GraphQLObjectType({
    name: "EventDelivery",
    description: "Event deliveries.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        createdAt: { type: GraphQLString },
        status: { type: GraphQLString },
        eventType: { type: GraphQLString },
        attempts: { type: EventDeliveryAttemptCountableConnection },
        payload: { type: GraphQLString }
    })
});