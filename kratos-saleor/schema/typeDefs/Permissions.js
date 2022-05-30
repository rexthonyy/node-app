const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLID
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "Permissions",
    description: "Represents a permission object in a friendly form.",
    fields: () => ({
        code: { type: GraphQLString },
        name: { type: GraphQLString }
    })
});