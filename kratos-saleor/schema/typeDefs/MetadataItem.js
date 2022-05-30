const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLID
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "MetadataItem",
    description: "List of private metadata items. Requires staff permissions to access.",
    fields: () => ({
            key: { type: GraphQLString },
            value: { type: GraphQLString }
    })
});