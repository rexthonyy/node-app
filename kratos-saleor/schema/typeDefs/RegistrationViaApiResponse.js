const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList
} = require("graphql");

// data types
const Identity = require("./Identity");
const Session = require("./Session");

module.exports = new GraphQLObjectType({
    name: "RegistrationViaApiResponse_",
    description: "The Response for Registration Flows via API",
    fields: () => ({
            identity: { type: GraphQLNonNull(Identity)},
            session: { type: Session },
            sessionToken: { type: GraphQLNonNull(GraphQLString), description: "The Session Token\n\nThis field is only set when the session hook is configured as a post-registration hook.\n\nA session token is equivalent to a session cookie, but it can be sent in the HTTP Authorization Header:\n\nAuthorization: bearer ${session-token}\n\nThe session token is only issued for API flows, not for Browser flows!" }
    })
});