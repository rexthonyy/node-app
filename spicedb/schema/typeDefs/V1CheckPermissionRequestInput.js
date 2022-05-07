const {
    GraphQLString,
    GraphQLNonNull,
    GraphQLObjectInputType,
} = require("graphql");

const V1ConsistencyInput = require("./V1ConsistencyInput");
const V1ObjectReferenceInput = require("./V1ObjectReferenceInput");
const V1SubjectReferenceInput = require("./V1SubjectReferenceInput");

module.exports = new GraphQLObjectInputType({
    name: "V1CheckPermissionRequestInput_",
    description: "CheckPermissionRequest issues a check on whether a subject has a permission or is a member of a relation, on a specific resource.",
    fields: () => ({
        consistency: { type: V1ConsistencyInput, description: "Consistency will define how a request is handled by the backend. By defining a consistency requirement, and a token at which those requirements should be applied, where applicable." },
        permission: { type: GraphQLString, description: "permission is the name of the permission (or relation) on which to execute the check." },
        resource: { type: V1ObjectReferenceInput, description: "ObjectReference is used to refer to a specific object in the system." },
        subject: { type: V1SubjectReferenceInput }
    })
});