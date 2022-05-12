const {
    GraphQLString,
    GraphQLObjectType,
} = require("graphql");

const V1ObjectReferenceInput = require("./V1ObjectReferenceInput");

module.exports = new GraphQLObjectType({
    name: "V1SubjectReference_",
    description: "CheckPermissionRequest issues a check on whether a subject has a permission or is a member of a relation, on a specific resource.",
    fields: () => ({
        object: { type: V1ObjectReferenceInput, description: "ObjectReference is used to refer to a specific object in the system." },
        optionalRelation: { type: GraphQLString }
    })
});