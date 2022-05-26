const {
    GraphQLString,
    GraphQLInputObjectType,
} = require("graphql");

const V1SubjectFilterInput = require("./V1SubjectFilterInput");

module.exports = new GraphQLInputObjectType({
    name: "V1RelationshipFilterInput_",
    description: "RelationshipFilter is a collection of filters which when applied to a relationship will return relationships that have exactly matching fields.\n\nresource_type is required. All other fields are optional and if left unspecified will not filter relationships.",
    fields: () => ({
        optionalRelation: { type: GraphQLString },
        optionalResourceId: { type: GraphQLString },
        optionalSubjectFilter: { type: GraphQLString, description: "SubjectFilter specifies a filter on the subject of a relationship.\n\nsubject_type is required and all other fields are optional, and will not impose any additional requirements if left unspecified." },
        resourceType: { type: GraphQLString }
    })
});