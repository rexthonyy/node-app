const {
    GraphQLNonNull,
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} = require("graphql");

// data types
const ForumType = require("./ForumType");
const TopicType = require("./TopicType");

// resolvers
const getForumsResolver = require("../resolvers/getForumsResolver");
const getForumByIdResolver = require("../resolvers/getForumByIdResolver");
const getTopicByIdResolver = require("../resolvers/getTopicByIdResolver");
const searchTopicResolver = require("../resolvers/searchTopicResolver");


module.exports = new GraphQLObjectType({
    name: "Query",
    description: 'Root Query',
    fields: () => ({
        ping: {
            type: GraphQLString,
            resolve: () => "pong"
        },
        getForums_: {
            type: GraphQLList(ForumType),
            description: "Returns the list of forums",
            resolve: getForumsResolver
        },
        getForumById_: {
            type: ForumType,
            description: "Returns a forum",
            args: {
                forum_id: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve: getForumByIdResolver
        },
        getTopicById_: {
            type: TopicType,
            description: "Returns a topic",
            args: {
                topic_id: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve: getTopicByIdResolver
        },
        searchTopics_: {
            type: TopicType,
            description: "Search for a topic",
            args: {
                query: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: searchTopicResolver
        }
    })
});
