const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLID,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLList
} = require("graphql");
const TopicType = require("./TopicType");

module.exports = new GraphQLObjectType({
    name: "Forum",
    description: "A forum object",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID)},
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        topics_count: { type: GraphQLInt },
        last_post_date: { type: GraphQLString },
        last_post_id: { type: GraphQLInt },
        private: { type: GraphQLBoolean },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString },
        allow_topic_voting: { type: GraphQLBoolean },
        allow_post_voting: { type: GraphQLBoolean },
        topics: { type: GraphQLList(TopicType)}
    })
});