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
const updateBranchResolver = require("../resolvers/updateBranchResolver");
const deleteBranchResolver = require("../resolvers/deleteBranchResolver");
const createServiceCategoryResolver = require("../resolvers/createServiceCategoryResolver");

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
        updateBranch_: {
            type: StatusMessageResponseType,
            description: "Updates a new branch",
            args: {
                branch_id: { type: GraphQLNonNull(GraphQLID) },
                locale_id: { type: GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLNonNull(GraphQLString) },
                address: { type: GraphQLNonNull(GraphQLString) },
                location: { type: GraphQLNonNull(GraphQLString) },
                ref: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: updateBranchResolver
        },
        deleteBranch_: {
            type: StatusMessageResponseType,
            description: "Deletes a branch",
            args: {
                branch_id: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve: deleteBranchResolver
        },
        createServiceCategory_: {
            type: StatusMessageResponseType,
            description: "Creates a new service category",
            args: {
                branch_id: { type: GraphQLNonNull(GraphQLID) },
                locale_id: { type: GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: createServiceCategoryResolver
        },
    })
});
