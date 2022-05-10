const {
    GraphQLString,
    GraphQLInputObjectType,
} = require("graphql");

module.exports = new GraphQLInputObjectType({
    name: "V1CheckPermissionRequestInput_",
    description: "CheckPermissionRequest issues a check on whether a subject has a permission or is a member of a relation, on a specific resource.",
    fields: () => ({
        permission: { type: GraphQLString, description: "permission is the name of the permission (or relation) on which to execute the check." },
        resource: { type: GraphQLString, description: "ObjectReference is used to refer to a specific object in the system." },
        subject: { type: GraphQLString }
    })
});