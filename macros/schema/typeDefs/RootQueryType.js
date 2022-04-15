const {
    GraphQLNonNull,
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} = require("graphql");

//typedefs
//const SearchTagType = require("./SearchTagType");

// resolvers
//const getTagsResolver = require("../resolvers/getTagsResolver");

module.exports = new GraphQLObjectType({
    name: "Query",
    description: 'Root Query',
    fields: () => ({
        ping: {
            type: GraphQLString,
            resolve: () => "pong"
        }
    })
});
