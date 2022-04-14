const {
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLID
} = require("graphql");

module.exports = new GraphQLInputObjectType({
    name: "TicketArticleUpdateInputType",
    description: "An object that is used to update a ticket article",
    fields: () => ({
        id: { type: GraphQLID },
        subject: { type: GraphQLString },
        body: { type: GraphQLString },
        type: { type: GraphQLString },
        internal: { type: GraphQLBoolean }
    })
});