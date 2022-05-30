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
    name: "AttributeValueFilterInput",
    fields: () => ({
        search: { type: GraphQLString },
        ids: { type: GraphQLList(GraphQLNonNull(GraphQLID)) }
    })
});