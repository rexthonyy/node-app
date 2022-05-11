const {
    GraphQLInputObjectType,
    GraphQLString,
} = require("graphql");

const V1ConsistencyInput = require("./V1ConsistencyInput");
const V1SubjectReferenceInput = require("./V1SubjectReferenceInput");

module.exports = new GraphQLInputObjectType({
    name: "V1LookupResourcesRequestInput_",
    description: "LookupResourcesRequest performs a lookup of all resources of a particular kind on which the subject has the specified permission or the relation in which the subject exists, streaming back the IDs of those resources.",
    fields: () => ({
        consistency: { type: V1ConsistencyInput, description: "Consistency will define how a request is handled by the backend. By defining a consistency requirement, and a token at which those requirements should be applied, where applicable." },
        permission: { type: GraphQLString, description: "permission is the name of the permission or relation for which the subject must Check." },
        resourceObjectType: { type: GraphQLString, description: "resource_object_type is the type of resource object for which the IDs will be returned." },
        subject: { type: V1SubjectReferenceInput }
    })
});