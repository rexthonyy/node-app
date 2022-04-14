const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLBoolean
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "TicketArticleType",
    description: "An object that represents a ticket article",
    fields: () => ({
            id: { type: GraphQLID },
            ticket_id: { type: GraphQLID },
            type_id: { type: GraphQLID },
            sender_id: { type: GraphQLID },
            from_: { type: GraphQLString },
            to_: { type: GraphQLString },
            cc: { type: GraphQLString },
            subject: { type: GraphQLString },
            reply_to: { type: GraphQLString },
            message_id: { type: GraphQLInt },
            message_id_md5: { type: GraphQLString },
            in_reply_to: { type: GraphQLString },
            content_type: { type: GraphQLString },
            references_: { type: GraphQLString },
            body: { type: GraphQLString },
            internal: { type: GraphQLBoolean },
            preferences: { type: GraphQLString },
            updated_by_id: { type: GraphQLID },
            created_by_id: { type: GraphQLID },
            origin_by_id: { type: GraphQLID },
            created_at: { type: GraphQLString },
            updated_at: { type: GraphQLString }
    })
});