const {
    GraphQLString,
    GraphQLNonNull,
    GraphQLInputObjectType
} = require("graphql");

module.exports = new GraphQLInputObjectType({
    name: "RecoveryLinkInput_",
    fields: () => ({
            expiresIn: { type: GraphQLString, description: "Link Expires In\n\nThe recovery link will expire at that point in time. Defaults to the configuration value of `selfservice.flows.recovery.request_lifespan`." },
            identityId: { type: GraphQLNonNull(GraphQLString) }
    })
});