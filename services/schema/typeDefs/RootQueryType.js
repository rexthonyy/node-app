const {
    GraphQLNonNull,
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} = require("graphql");


// data types
const BranchTranslationType = require("./BranchTranslationType");

// resolvers
const getAllBranchesResolver = require("../resolvers/getAllBranchesResolver");

module.exports = new GraphQLObjectType({
    name: "Query",
    description: 'Root Query',
    fields: () => ({
        ping: {
            type: GraphQLString,
            resolve: () => "pong"
        },
        getAllBranches_: {
            type: GraphQLList(BranchTranslationType),
            description: "Get all branches for a given translation",
            args: {
                locale_id: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve: getAllBranchesResolver
        },
        getAllServiceCategories_: {
            type: GraphQLList(ServiceCategoryTranslationType),
            description: "Get all service categories for a given branch and translation",
            args: {
                locale_id: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve: getAllBranchesResolver
        },
        
    })
});
