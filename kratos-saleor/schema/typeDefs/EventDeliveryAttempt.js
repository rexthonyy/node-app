const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLID,
    GraphQLFloat
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "EventDeliveryAttempt",
    description: "Event delivery attempts.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        createdAt: { type: GraphQLNonNull(GraphQLString) },
        taskId: { type: GraphQLString },
        duration: { type: GraphQLFloat },
        response: { type: GraphQLString },
        responseHeaders: { type: GraphQLString },
        responseStatusCode: { type: GraphQLInt },
        requestHeaders: { type: GraphQLString },
        status: { type: GraphQLString }
    })
});