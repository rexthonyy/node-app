const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLID
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "WebhookEvent",
    description: "List of webhook events.",
    fields: () => ({
        name: { type: GraphQLString },
        eventType: { type: GraphQLString }
    })
});