const {
    GraphQLString,
    GraphQLList,
    GraphQLObjectType,
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "GroupCountableConnection",
    description: "Represents permission group data.",
    fields: () => ({
        name: { type: GraphQLString },
        permissions: { type: GraphQLList(GraphQLString) }
    })
});