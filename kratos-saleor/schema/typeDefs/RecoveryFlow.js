const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLID,
    GraphQLList
} = require("graphql");

// data types
const UiText = require("./UiText");

module.exports = new GraphQLObjectType({
    name: "RecoveryFlow_",
    description: "This request is used when an identity wants to recover their account.",
    fields: () => ({
            active: { type: GraphQLString, description: "Active, if set, contains the registration method that is being used. It is initially not set." },
            expiresAt: { type: GraphQLNonNull(GraphQLString), description: "ExpiresAt is the time (UTC) when the request expires. If the user still wishes to update the setting, a new request has to be initiated." },
            id: { type: GraphQLNonNull(GraphQLString) },
            issuedAt: { type: GraphQLNonNull(GraphQLString), description: "IssuedAt is the time (UTC) when the request occurred." },
            messages: { type: GraphQLList(UiText) },
            methods: { type: GraphQLNonNull(GraphQLString), description: "Methods contains context for all account recovery methods. If a registration request has been processed, but for example the password is incorrect, this will contain error messages." },
            requestUrl: { type: GraphQLNonNull(GraphQLString), description: "RequestURL is the initial URL that was requested from Ory Kratos. It can be used to forward information contained in the URL's path or query for example." },
            state: { type: GraphQLNonNull(GraphQLString) },
            type: { type: GraphQLString, description: "The flow type can either be `api` or `browser`." }

    })
});