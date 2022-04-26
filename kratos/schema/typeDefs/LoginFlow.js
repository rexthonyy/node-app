const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLID
} = require("graphql");

// data types
const UiContainer = require("./UiContainer");

module.exports = new GraphQLObjectType({
    name: "LoginFlow_",
    description: "This object represents a login flow. A login flow is initiated at the \"Initiate Login API / Browser Flow\" endpoint by a client.\n\nOnce a login flow is completed successfully, a session cookie or session token will be issued.",
    fields: () => ({
            active: { type: GraphQLString, description: "and so on." },
            expiresAt: { type: GraphQLNonNull(GraphQLString), description: "ExpiresAt is the time (UTC) when the flow expires. If the user still wishes to log in, a new flow has to be initiated." },
            forced: { type: GraphQLBoolean, description: "Forced stores whether this login flow should enforce re-authentication." },
            id: { type: GraphQLNonNull(GraphQLID) },
            issuedAt: { type: GraphQLNonNull(GraphQLString), description: "IssuedAt is the time (UTC) when the flow started." },
            requestUrl: { type: GraphQLNonNull(GraphQLString), description: "RequestURL is the initial URL that was requested from Ory Kratos. It can be used to forward information contained in the URL's path or query for example." },
            type: { type: GraphQLNonNull(GraphQLString), description: "The flow type can either be `api` or `browser`." },
            ui: { type: GraphQLNonNull(UiContainer), description: "Container represents a HTML Form. The container can work with both HTTP Form and JSON requests" }

    })
});