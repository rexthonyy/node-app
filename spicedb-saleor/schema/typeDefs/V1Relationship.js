const {
    GraphQLString,
    GraphQLObjectType,
} = require("graphql");

const V1ObjectReference = require("./V1ObjectReference");
const V1SubjectReference = require("./V1SubjectReference");

module.exports = new GraphQLObjectType({
    name: "V1Relationship_",
    description: "Relationship specifies how a resource relates to a subject. Relationships form the data for the graph over which all permissions questions are answered.",
    fields: () => ({
        relation: { type: GraphQLString, description: "relation is how the resource and subject are related." },
        resource: { type: GraphQLString, description: "ObjectReference is used to refer to a specific object in the system." },
        subject: { type: GraphQLString }
    })
});