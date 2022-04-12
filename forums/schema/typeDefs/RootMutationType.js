const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLNonNull
} = require("graphql");


// data types
const TopicType = require("./TopicType");
const PostTypeInput = require("./PostTypeInput");
const StatusMessageResponseType = require("./StatusMessageResponseType");

// resolvers
const voteTopicByIdResolver = require("../resolvers/voteTopicByIdResolver");
const schedulePostPublishResolver = require("../resolvers/schedulePostPublishResolver");
const schedulePostUpdateResolver = require("../resolvers/schedulePostUpdateResolver");
const schedulePostDeleteResolver = require("../resolvers/schedulePostDeleteResolver");
const scheduleTopicPublishResolver = require("../resolvers/scheduleTopicPublishResolver");
const scheduleTopicUpdateResolver = require("../resolvers/scheduleTopicUpdateResolver");
const scheduleTopicDeleteResolver = require("../resolvers/scheduleTopicDeleteResolver");

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
        schedulePostPublish_: {
            type: StatusMessageResponseType,
            description: "Schedules a post for publication in the future",
            args: {
                run_at: { type: GraphQLNonNull(GraphQLString) },
                metadata: { type: GraphQLNonNull(PostTypeInput) }
            },
            resolve: schedulePostPublishResolver
        },
        schedulePostUpdate_: {
            type: StatusMessageResponseType,
            description: "Schedules a post for update in the future",
            args: {
                post_id: { type: GraphQLNonNull(GraphQLID) },
                run_at: { type: GraphQLNonNull(GraphQLString) },
                metadata: { type: GraphQLNonNull(PostTypeInput) }
            },
            resolve: schedulePostUpdateResolver
        },
        schedulePostDelete_: {
            type: StatusMessageResponseType,
            description: "Schedules a post for deletion in the future",
            args: {
                post_id: { type: GraphQLNonNull(GraphQLID) },
                run_at: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: schedulePostDeleteResolver
        },
        scheduleTopicPublish_: {
            type: StatusMessageResponseType,
            description: "Schedules a topic for publication in the future",
            args: {
                run_at: { type: GraphQLNonNull(GraphQLString) },
                metadata: { type: GraphQLNonNull(PostTypeInput) }
            },
            resolve: scheduleTopicPublishResolver
        },
        scheduleTopicUpdate_: {
            type: StatusMessageResponseType,
            description: "Schedules a topic for update in the future",
            args: {
                topic_id: { type: GraphQLNonNull(GraphQLID) },
                run_at: { type: GraphQLNonNull(GraphQLString) },
                metadata: { type: GraphQLNonNull(PostTypeInput) }
            },
            resolve: scheduleTopicUpdateResolver
        },
        scheduleTopicDelete_: {
            type: StatusMessageResponseType,
            description: "Schedules a topic for deletion in the future",
            args: {
                topic_id: { type: GraphQLNonNull(GraphQLID) },
                run_at: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: scheduleTopicDeleteResolver
        }
    })
});
