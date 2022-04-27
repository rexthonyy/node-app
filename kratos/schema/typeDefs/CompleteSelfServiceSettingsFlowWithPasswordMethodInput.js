const {
    GraphQLString,
    GraphQLInputObjectType,
    GraphQLNonNull
} = require("graphql");

module.exports = new GraphQLInputObjectType({
    name: "CompleteSelfServiceSettingsFlowWithPasswordMethodInput_",
    fields: () => ({
            csrfToken: { type: GraphQLString, description: "CSRFToken is the anti-CSRF token\n\ntype: string" },
            password: { type: GraphQLNonNull(GraphQLString), description: "Password is the updated password\n\ntype: string" }
    })
});