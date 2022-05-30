const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLID
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "AppToken",
    description: "Represents token data.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        appToken: { type: GraphQLString }
    })
});