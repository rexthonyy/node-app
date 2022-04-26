const {
    GraphQLNonNull,
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} = require("graphql");

// data types
const ErrorContainer = require("./ErrorContainer");

// resolvers
const getErrorContainerResolver = require("../resolvers/getErrorContainerResolver");

module.exports = new GraphQLObjectType({
    name: "Query",
    description: 'Root Query',
    fields: () => ({
        ping: {
            type: GraphQLString,
            resolve: () => "pong"
        },
        errorContainer_: {
            type: ErrorContainer,
            description: `
            This endpoint returns the error associated with a user-facing self service errors.

            This endpoint supports stub values to help you implement the error UI:

            ?error=stub:500 - returns a stub 500 (Internal Server Error) error.
            `,
            args: {
                error: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: getErrorContainerResolver
        },
    })
});
