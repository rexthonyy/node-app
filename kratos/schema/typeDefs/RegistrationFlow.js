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
    name: "RegistrationFlow_",
    fields: () => ({
            active: { type: GraphQLString, description: "and so on." },
            expiresAt: { type: GraphQLNonNull(GraphQLString), description: "ExpiresAt is the time (UTC) when the flow expires. If the user still wishes to log in, a new flow has to be initiated." },
            id: { type: GraphQLNonNull(GraphQLString) },
            issuedAt: { type: GraphQLNonNull(GraphQLString), description: "IssuedAt is the time (UTC) when the flow occurred." },
            messages: { type: GraphQLList(UiText) },
            methods: { type: GraphQLNonNull(GraphQLString), description: "Methods contains context for all enabled registration methods. If a registration flow has been processed, but for example the password is incorrect, this will contain error messages." },
            requestUrl: { type: GraphQLNonNull(GraphQLString), description: "RequestURL is the initial URL that was requested from Ory Kratos. It can be used to forward information contained in the URL's path or query for example." },
            type: { type: GraphQLString, description: "The flow type can either be `api` or `browser`." }
    })
});