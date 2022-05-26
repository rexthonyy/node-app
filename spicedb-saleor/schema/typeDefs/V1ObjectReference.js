const {
    GraphQLString,
    GraphQLObjectType,
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "V1ObjectReference_",
    description: "ObjectReference is used to refer to a specific object in the system.",
    fields: () => ({
        objectId: { type: GraphQLString },
        objectType: { type: GraphQLString }
    })
});