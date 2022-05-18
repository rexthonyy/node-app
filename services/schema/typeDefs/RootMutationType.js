const {
    GraphQLObjectType,
    GraphQLList,
    GraphQLString,
    GraphQLNonNull,
    GraphQLID
} = require("graphql");

// typedefs
const StatusMessageResponseType = require("./StatusMessageResponseType");

// resolvers
const createBranchResolver = require("../resolvers/createBranchResolver");

module.exports = new GraphQLObjectType({
    name: "Mutation",
    description: 'Root Mutation',
    fields: () => ({
        ping: {
            type: GraphQLString,
            resolve: () => "pong"
        },
        createBranch_: {
            type: StatusMessageResponseType,
            description: "Creates a new branch",
            args: {
                locale_id: { type: GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLNonNull(GraphQLString) },
                address: { type: GraphQLNonNull(GraphQLString) },
                location: { type: GraphQLNonNull(GraphQLString) },
                ref: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: createBranchResolver
        },
    })
});
