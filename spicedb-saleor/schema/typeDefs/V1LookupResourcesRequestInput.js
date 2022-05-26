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
        permission: { type: GraphQLString, description: "permission is the name of the permission or relation for which the subject must Check." },
        subject: { type: GraphQLString }
    })
});