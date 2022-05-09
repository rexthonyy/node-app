const {
    GraphQLString,
    GraphQLInputObjectType,
} = require("graphql");

module.exports = new GraphQLInputObjectType({
    name: "V1ZedTokenInput_",
    description: "ZedToken is used to provide causality metadata between Write and Check requests.\n\nSee the authzed.api.v1.Consistency message for more information.",
    fields: () => ({
            token: { type: GraphQLString }
    })
});