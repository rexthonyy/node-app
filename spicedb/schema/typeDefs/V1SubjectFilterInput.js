const {
    GraphQLString,
    GraphQLInputObjectType,
} = require("graphql");

const SubjectFilterRelationFilterInput = require("./SubjectFilterRelationFilterInput");

module.exports = new GraphQLInputObjectType({
    name: "V1SubjectFilterInput_",
    description: "SubjectFilter specifies a filter on the subject of a relationship.\n\nsubject_type is required and all other fields are optional, and will not impose any additional requirements if left unspecified.",
    fields: () => ({
        optionalRelation: { type: SubjectFilterRelationFilterInput },
        optionalSubjectId: { type: GraphQLString },
        subjectType: { type: GraphQLString }
    })
});