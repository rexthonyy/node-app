const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "CompleteSelfServiceLoginFlowWithPasswordMethodInput_",
    fields: () => ({
            csrfToken: { type: GraphQLString, description: "Sending the anti-csrf token is only required for browser login flows." },
            identifier: { type: GraphQLString, description: "Identifier is the email or username of the user trying to log in." },
            password: { type: GraphQLString, description: "The user's password." },
    })
});