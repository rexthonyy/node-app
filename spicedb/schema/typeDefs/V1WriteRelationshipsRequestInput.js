const {
    GraphQLInputObjectType
} = require("graphql");

const V1PreconditionInput = require("./V1PreconditionInput");
const V1RelationshipUpdateInput = require("./V1RelationshipUpdateInput");

module.exports = new GraphQLInputObjectType({
    name: "V1WriteRelationshipsRequestInput_",
    description: "WriteRelationshipsRequest contains a list of Relationship mutations that should be applied to the service. If the optional_preconditions parameter is included, all of the specified preconditions must also be satisfied before the write will be committed.",
    fields: () => ({
        optionalPreconditions: { type: GraphQLList(V1PreconditionInput) },
        updates: { type: GraphQLList(V1RelationshipUpdateInput) }
    })
});