const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLNonNull
} = require("graphql");


// data types
const TicketType = require("./TicketType");
const TicketArticleInputType = require("./TicketArticleInputType");

// resolvers
const createTicketResolver = require("../resolvers/createTicketResolver");


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
        }
    })
});
