const {
    GraphQLString,
    GraphQLID,
    GraphQLBoolean,
    GraphQLInputObjectType,
    GraphQLInt
} = require("graphql");

module.exports = new GraphQLInputObjectType({
    name: "PostTypeInput",
    description: "An input post object",
    fields: () => ({
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
        email_to_address: { type: GraphQLString }
    })
});