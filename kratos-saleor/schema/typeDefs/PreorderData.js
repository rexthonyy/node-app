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
    name: "PreorderData",
    description: "Represents preorder settings for product variant.",
    fields: () => ({
        globalThreshold: { type: GraphQLInt },
        globalSoldUnits: { type: GraphQLNonNull(GraphQLInt) },
        endDate: { type: GraphQLString }
    })
});