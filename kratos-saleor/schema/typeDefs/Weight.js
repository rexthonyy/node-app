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
    name: "Weight",
    description: "Represents weight value in a specific weight unit.",
    fields: () => ({
        unit: { type: GraphQLString },
        value: { type: GraphQLFloat }
    })
});