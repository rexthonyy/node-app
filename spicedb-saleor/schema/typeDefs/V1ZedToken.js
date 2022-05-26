const {
    GraphQLString,
    GraphQLObjectType,
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "V1ZedToken_",
    description: "ZedToken is used to provide causality metadata between Write and Check requests.\n\nSee the authzed.api.v1.Consistency message for more information.",
    fields: () => ({
            token: { type: GraphQLString }
    })
});