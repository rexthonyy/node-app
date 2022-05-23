const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList
} = require("graphql");

// data types
const Session = require("./Session");

module.exports = new GraphQLObjectType({
    name: "LoginViaApiResponse_",
    description: "The Response for Login Flows via API",
    fields: () => ({
            session: { type: GraphQLNonNull(Session) },
            sessionToken: { type: GraphQLNonNull(GraphQLString), description: "The Session Token\n\nA session token is equivalent to a session cookie, but it can be sent in the HTTP Authorization Header:\n\nAuthorization: bearer ${session-token}\n\nThe session token is only issued for API flows, not for Browser flows!" }
    })
});