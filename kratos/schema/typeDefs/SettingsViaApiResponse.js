const {
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLInputObjectType
} = require("graphql");

// data types
const Identity = require("./Identity");
const SettingsFlow = require("./SettingsFlow");

module.exports = new GraphQLInputObjectType({
    name: "SettingsViaApiResponse_",
    description: "The Response for Settings Flows via API",
    fields: () => ({
            flow: { type: GraphQLNonNull(SettingsFlow), description: "This flow is used when an identity wants to update settings (e.g. profile data, passwords, ...) in a selfservice manner.\n\nWe recommend reading the User Settings Documentation" },
            identity: { type: GraphQLNonNull(Identity) }
    })
});