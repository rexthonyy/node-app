const {
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLBoolean
} = require("graphql");

module.exports = new GraphQLInputObjectType({
    name: "TicketArticleInputType",
    description: "An object that is used to create a ticket",
    fields: () => ({
            subject: { type: GraphQLString },
            body: { type: GraphQLString },
            type: { type: GraphQLString },
            internal: { type: GraphQLBoolean }
    })
});