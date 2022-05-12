const {
    GraphQLInputObjectType
} = require("graphql");

const V1ConsistencyInput = require("./V1ConsistencyInput");
const V1RelationshipFilterInput = require("./V1RelationshipFilterInput");

module.exports = new GraphQLInputObjectType({
    name: "V1ReadRelationshipsRequestInput_",
    description: "ReadRelationshipsRequest specifies one or more filters used to read matching relationships within the system.",
    fields: () => ({
        consistency: { type: V1ConsistencyInput, description: "Consistency will define how a request is handled by the backend. By defining a consistency requirement, and a token at which those requirements should be applied, where applicable." },
        relationshipFilter: { type: V1RelationshipFilterInput, description: "RelationshipFilter is a collection of filters which when applied to a relationship will return relationships that have exactly matching fields.\n\nresource_type is required. All other fields are optional and if left unspecified will not filter relationships." }
    })
});