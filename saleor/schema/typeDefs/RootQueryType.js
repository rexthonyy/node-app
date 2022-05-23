const {
    GraphQLNonNull,
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} = require("graphql");


// data types
const TicketArticleType = require("./TicketArticleType");

// resolvers
const getTicketArticlesByTicketIdResolver = require("../resolvers/getTicketArticlesByTicketIdResolver");

module.exports = new GraphQLObjectType({
    name: "Query",
    description: 'Root Query',
    fields: () => ({
        ping: {
            type: GraphQLString,
            resolve: () => "pong"
        },
        getTicketArticlesByTicketId_: {
            type: GraphQLList(TicketArticleType),
            description: "Returns a list of ticket articles",
            args: {
                ticket_id: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve: getTicketArticlesByTicketIdResolver
        }
    })
});
