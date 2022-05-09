const {
    GraphQLString,
    GraphQLNonNull,
    GraphQLInputObjectType,
} = require("graphql");

module.exports = new GraphQLInputObjectType({
    name: "V1ObjectReferenceInput_",
    description: "ObjectReference is used to refer to a specific object in the system.",
    fields: () => ({
        objectId: { type: GraphQLString },
        objectType: { type: GraphQLString }
    })
});