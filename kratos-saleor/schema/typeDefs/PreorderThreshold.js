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
    name: "PreorderThreshold",
    description: "Represents preorder variant data for channel.",
    fields: () => ({
        quantity: { type: GraphQLInt },
        soldUnits: { type: GraphQLNonNull(GraphQLInt) }
    })
});