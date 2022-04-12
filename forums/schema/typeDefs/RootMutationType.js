const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull
} = require("graphql");


// data types
const TopicType = require("./TopicType");

// resolvers
const voteTopicByIdResolver = require("../resolvers/voteTopicByIdResolver");

module.exports = new GraphQLObjectType({
    name: "Mutation",
    description: 'Root Mutation',
    fields: () => ({
        ping: {
            type: GraphQLString,
            resolve: () => "pong"
        },
        voteTopicById_: {
            type: TopicType,
            description: "Votes for a topic",
            args: {
                topic_id: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve: voteTopicByIdResolver
        },
    })
});
