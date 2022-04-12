const {
    GraphQLString,
    GraphQLID,
    GraphQLBoolean,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLNonNull
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "PostType",
    description: "A post object",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID)},
        topic_id: { type: GraphQLID },
        user_id: { type: GraphQLString },
        body: { type: GraphQLString },
        kind: { type: GraphQLString },
        active: { type: GraphQLBoolean },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString },
        points: { type: GraphQLInt },
        attachements: { type: GraphQLString },
        cc: { type: GraphQLString },
        bcc: { type: GraphQLString },
        raw_email: { type: GraphQLString },
        email_to_address: { type: GraphQLString },
        is_delete_scheduled: { type: GraphQLBoolean },
        is_update_scheduled: { type: GraphQLBoolean }
    })
});