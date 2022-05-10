const {
    GraphQLString,
    GraphQLNonNull,
    GraphQLInputObjectType,
} = require("graphql");

const V1PreconditionInput = require("./V1PreconditionInput");
const V1RelationshipFilterInput = require("./V1RelationshipFilterInput");

module.exports = new GraphQLInputObjectType({
    name: "V1DeleteRelationshipsRequestInput_",
    description: "DeleteRelationshipsRequest specifies which Relationships should be deleted, requesting the delete of ALL relationships that match the specified filters. If the optional_preconditions parameter is included, all of the specified preconditions must also be satisfied before the delete will be executed.",
    fields: () => ({
        optionalPrecondition: { type: GraphQLNonNull(V1PreconditionInput) },
        relationshipFilter: { type: V1RelationshipFilterInput, description: "RelationshipFilter is a collection of filters which when applied to a relationship will return relationships that have exactly matching fields.\n\nresource_type is required. All other fields are optional and if left unspecified will not filter relationships." }
    })
});