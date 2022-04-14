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
        }
    })
});
