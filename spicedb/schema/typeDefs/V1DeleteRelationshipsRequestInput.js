const {
    GraphQLInputObjectType,
} = require("graphql");

const V1PreconditionInput = require("./V1PreconditionInput");
const V1RelationshipFilterInput = require("./V1RelationshipFilterInput");

module.exports = new GraphQLInputObjectType({
    name: "V1DeleteRelationshipsRequestInput_",
    description: "DeleteRelationshipsRequest specifies which Relationships should be deleted, requesting the delete of ALL relationships that match the specified filters. If the optional_preconditions parameter is included, all of the specified preconditions must also be satisfied before the delete will be executed.",
    fields: () => ({
        optionalRelation: { type: GraphQLString },
        optionalResourceId: { type: GraphQLString },
        optionalSubjectFilter: { type: GraphQLString, description: "SubjectFilter specifies a filter on the subject of a relationship.\n\nsubject_type is required and all other fields are optional, and will not impose any additional requirements if left unspecified." }
    })
});