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
    name: "VerificationFlow_",
    description: "Used to verify an out-of-band communication channel such as an email address or a phone number.\n\nFor more information head over to: https://www.ory.sh/docs/kratos/selfservice/flows/verify-email-account-activation",
    fields: () => ({
            active: { type: GraphQLString, description: "Active, if set, contains the registration method that is being used. It is initially not set." },
            expiresAt: { type: GraphQLString, description: "ExpiresAt is the time (UTC) when the request expires. If the user still wishes to verify the address, a new request has to be initiated." },
            id: { type: GraphQLNonNull(GraphQLString) },
            issuedAt: { type: GraphQLString, description: "IssuedAt is the time (UTC) when the request occurred." },
            messages: { type: GraphQLList(UiText) },
            methods: { type: GraphQLNonNull(GraphQLString), description: "Methods contains context for all account verification methods. If a registration request has been processed, but for example the password is incorrect, this will contain error messages." },
            requestUrl: { type: GraphQLString, description: "RequestURL is the initial URL that was requested from Ory Kratos. It can be used to forward information contained in the URL's path or query for example." },
            state: { type: GraphQLNonNull(GraphQLString) },
            type: { type: GraphQLNonNull(GraphQLString), description: "The flow type can either be `api` or `browser`." }
    })
});