const {
    GraphQLNonNull,
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} = require("graphql");

//typedefs
const SearchTagType = require("./SearchTagType");

// resolvers
const getTagsResolver = require("../resolvers/getTagsResolver");
const searchTagsResolver = require("../resolvers/searchTagsResolver");

module.exports = new GraphQLObjectType({
    name: "Query",
    description: 'Root Query',
    fields: () => ({
        ping: {
            type: GraphQLString,
            resolve: () => "pong"
        },
        getTags_: {
            type: GraphQLList(GraphQLString),
            description: "Gets all tags for a given object",
            args: {
                object: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: getTagsResolver
        },
        searchTags_: {
            type: GraphQLList(SearchTagType),
            description: "Search for tags",
            args: {
                object: { type: GraphQLString },
                query: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: searchTagsResolver
        },

    })
});
