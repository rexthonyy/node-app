const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLID
} = require("graphql");


// data types
const WebhookEventSync = require("./WebhookEventSync");
const App = require("./App");
const WebhookEvent = require("./WebhookEvent");
const EventDeliveryCountableConnection = require("./EventDeliveryCountableConnection");

module.exports = new GraphQLObjectType({
    name: "Webhook",
    description: "Webhook.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        syncEvents: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(WebhookEventSync))) },
        asyncEvents: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(WebhookEventSync))) },
        app: { type: GraphQLNonNull(App) },
        eventDeliveries: { type: EventDeliveryCountableConnection },
        targetUrl: { type: GraphQLNonNull(GraphQLString) },
        isActive: { type: GraphQLNonNull(GraphQLBoolean) },
        secretKey: { type: GraphQLString },
        subscriptionQuery: { type: GraphQLString },
        events: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(WebhookEvent))) }
    })
});