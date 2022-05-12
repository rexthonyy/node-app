const {
    GraphQLObjectType
} = require("graphql");

const V1ZedToken = require("./V1ZedToken");
const V1Relationship = require("./V1Relationship");

module.exports = new GraphQLObjectType({
    name: "V1ReadRelationshipsResponse_",
    description: "ReadRelationshipsResponse contains a Relationship found that matches the specified relationship filter(s). A instance of this response message will be streamed to the client for each relationship found.",
    fields: () => ({
        readAt: { type: V1ZedToken, description: "ZedToken is used to provide causality metadata between Write and Check requests.\n\nSee the authzed.api.v1.Consistency message for more information." },
        relationship: { type: V1Relationship, description: "Relationship specifies how a resource relates to a subject. Relationships form the data for the graph over which all permissions questions are answered." }
    })
});