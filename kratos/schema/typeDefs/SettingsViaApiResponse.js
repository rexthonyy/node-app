const {
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLObjectType
} = require("graphql");

// data types
const Identity = require("./Identity");
const SettingsFlow = require("./SettingsFlow");

module.exports = new GraphQLObjectType({
    name: "SettingsViaApiResponse_",
    description: "The Response for Settings Flows via API",
    fields: () => ({
            flow: { type: GraphQLNonNull(SettingsFlow), description: "This flow is used when an identity wants to update settings (e.g. profile data, passwords, ...) in a selfservice manner.\n\nWe recommend reading the User Settings Documentation" },
            identity: { type: GraphQLNonNull(Identity) }
    })
});