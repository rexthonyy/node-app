const {
    GraphQLNonNull,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLList
} = require("graphql");
const PostType = require("./PostType");

module.exports = new GraphQLObjectType({
    name: "TopicType",
    description: "A topic object",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID)},
        forum_id: { type: GraphQLID },
        user_id: { type: GraphQLString },
        subject: { type: GraphQLString },
        points: { type: GraphQLInt },
        message: { type: GraphQLString },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString },
        posts: { type: GraphQLList(PostType)},
        is_delete_scheduled: { type: GraphQLBoolean },
        is_update_scheduled: { type: GraphQLBoolean }
    })
});