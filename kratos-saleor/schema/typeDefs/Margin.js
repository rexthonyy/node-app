const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLInt
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "Margin",
    description: "Range of margin percentage value. Requires one of the following permissions: MANAGE_PRODUCTS.",
    fields: () => ({
        start: { type: GraphQLInt },
        stop: { type: GraphQLInt }
    })
});