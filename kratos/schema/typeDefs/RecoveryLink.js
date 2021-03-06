const {
    GraphQLString,
    GraphQLNonNull,
    GraphQLObjectType,
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "RecoveryLink_",
    fields: () => ({
            expiresAt: { type: GraphQLString, description: "Recovery Link Expires At\n\nThe timestamp when the recovery link expires." },
            recoveryLink: { type: GraphQLNonNull(GraphQLString), description: "Recovery Link\n\nThis link can be used to recover the account." }
    })
});