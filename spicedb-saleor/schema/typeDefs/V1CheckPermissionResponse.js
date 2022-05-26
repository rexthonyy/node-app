const {
    GraphQLString,
    GraphQLObjectType,
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "V1CheckPermissionResponse_",
    fields: () => ({
            permissionship: { type: GraphQLString }
    })
});