const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList
} = require("graphql");

// data types
const Identity = require("./Identity");
const UiText = require("./UiText");

module.exports = new GraphQLObjectType({
    name: "SettingsFlow_",
    description: "This flow is used when an identity wants to update settings (e.g. profile data, passwords, ...) in a selfservice manner.\n\nWe recommend reading the User Settings Documentation",
    fields: () => ({
            active: { typ: GraphQLString, description: "Active, if set, contains the registration method that is being used. It is initially not set." },
            expiresAt: { type: GraphQLNonNull(GraphQLString), description: "ExpiresAt is the time (UTC) when the flow expires. If the user still wishes to update the setting, a new flow has to be initiated." },
            id: { type: GraphQLNonNull(GraphQLString) },
            identity: { type: GraphQLNonNull(Identity) },
            issuedAt: { type: GraphQLNonNull(GraphQLString), description: "IssuedAt is the time (UTC) when the flow occurred." },
            messages: { type: GraphQLList(UiText) },
            methods: { type: GraphQLNonNull(GraphQLString), description: "Methods contains context for all enabled registration methods. If a settings flow has been processed, but for example the first name is empty, this will contain error messages." },
            requestUrl: { type: GraphQLNonNull(GraphQLString), description: "RequestURL is the initial URL that was requested from Ory Kratos. It can be used to forward information contained in the URL's path or query for example." },
            state: { type: GraphQLNonNull(GraphQLString) },
            type: { type: GraphQLString, description: "The flow type can either be `api` or `browser`." }
            
    })
});