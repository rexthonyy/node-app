const {
    GraphQLString,
    GraphQLInputObjectType,
} = require("graphql");

const V1RelationshipFilterInput = require("./V1RelationshipFilterInput");

module.exports = new GraphQLInputObjectType({
    name: "V1RelationshipUpdateInput_",
    description: "Precondition specifies how and the existence or absence of certain relationships as expressed through the accompanying filter should affect whether or not the operation proceeds.\n\nMUST_NOT_MATCH will fail the parent request if any relationships match the relationships filter. MUST_MATCH will fail the parent request if there are no relationships that match the filter.",
    fields: () => ({
        filter: { type: V1RelationshipFilterInput, description: "RelationshipFilter is a collection of filters which when applied to a relationship will return relationships that have exactly matching fields.\n\nresource_type is required. All other fields are optional and if left unspecified will not filter relationships." },
        operation: { type: GraphQLString }
    })
});