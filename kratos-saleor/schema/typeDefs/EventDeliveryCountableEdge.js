const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLID
} = require("graphql");

// data types
const EventDelivery = require("./EventDelivery");


module.exports = new GraphQLObjectType({
    name: "EventDeliveryCountableEdge",
    description: "Event deliveries.",
    fields: () => ({
            node: { type: GraphQLNonNull(EventDelivery) },
            cursor: { type: GraphQLString }
    })
});