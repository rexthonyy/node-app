const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLID
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "Image",
    description: "Represents an image.",
    fields: () => ({
        url: { type: GraphQLNonNull(GraphQLString) },
        alt: { type: GraphQLString }
    })
});