const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLID,
    GraphQLInt
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "ProductMedia",
    description: "Represents a product media.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        sortOrder: { type: GraphQLInt },
        all: { type: GraphQLNonNull(GraphQLString) },
        type: { type: GraphQLNonNull(GraphQLString) },
        oembeddata: { type: GraphQLNonNull(GraphQLString) },
        url: { type: GraphQLString }
    })
});