const {
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLID,
    GraphQLInt
} = require("graphql");

module.exports = new GraphQLInputObjectType({
    name: "AttributeChoicesSortingInput",
    fields: () => ({
        direction: { type: GraphQLNonNull(GraphQLString) },
        field: { type: GraphQLNonNull(GraphQLString) }
    })
});