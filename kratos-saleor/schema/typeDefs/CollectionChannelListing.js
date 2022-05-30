const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLID
} = require("graphql");


// data types
const Channel = require("./Channel");

module.exports = new GraphQLObjectType({
    name: "CollectionChannelListing",
    description: "List of channels in which the collection is available. Requires one of the following permissions: MANAGE_PRODUCTS.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        publishedAt: { type: GraphQLString },
        isPublished: { type: GraphQLNonNull(GraphQLBoolean) },
        channel: { type: GraphQLNonNull(Channel) },
        publicationDate: { type: GraphQLString }
    })
});