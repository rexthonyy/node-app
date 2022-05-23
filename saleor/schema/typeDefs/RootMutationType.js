const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLNonNull
} = require("graphql");


// data types
const TicketType = require("./TicketType");
const TicketArticleInputType = require("./TicketArticleInputType");
const TicketArticleUpdateInputType = require("./TicketArticleUpdateInputType");
const StatusMessageResponseType = require("./StatusMessageResponseType");

// resolvers
const createTicketResolver = require("../resolvers/createTicketResolver");
const updateTicketResolver = require("../resolvers/updateTicketResolver");
const deleteTicketResolver = require("../resolvers/deleteTicketResolver");


module.exports = new GraphQLObjectType({
    name: "Mutation",
    description: 'Root Mutation',
    fields: () => ({
        ping: {
            type: GraphQLString,
            resolve: () => "pong"
        },
        createTicket_: {
            type: TicketType,
            description: "Creates a ticket with the corresponding article",
            args: {
                title: { type: GraphQLNonNull(GraphQLString) },
                group: { type: GraphQLString },
                customer: { type: GraphQLString },
                article: { type: GraphQLNonNull(TicketArticleInputType) }
            },
            resolve: createTicketResolver
        },
        updateTicket_: {
            type: StatusMessageResponseType,
            description: "Updates a ticket with the corresponding article",
            args: {
                ticket_id: { type: GraphQLNonNull(GraphQLID) },
                title: { type: GraphQLNonNull(GraphQLString) },
                group: { type: GraphQLString },
                state: { type: GraphQLString },
                priority: { type: GraphQLString },
                article: { type: GraphQLNonNull(TicketArticleUpdateInputType) }
            },
            resolve: updateTicketResolver
        },
        deleteTicket_: {
            type: StatusMessageResponseType,
            description: "Deletes a ticket with the corresponding article",
            args: {
                ticket_id: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve: deleteTicketResolver
        }
    })
});
