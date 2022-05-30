const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLID
} = require("graphql");


module.exports = new GraphQLObjectType({
    name: "WebhookEventSync",
    description: "Synchronous webhook event.",
    fields: () => ({
        name: { type: GraphQLString },
        eventType: { type: GraphQLString }
    })
});