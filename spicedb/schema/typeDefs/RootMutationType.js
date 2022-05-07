const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLNonNull
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "Mutation",
    description: 'Root Mutation',
    fields: () => ({
        ping: {
            type: GraphQLString,
            resolve: () => "pong"
        },
        permissionsServiceCheckPermission_: {
            type: ErrorContainer,
            description: "This endpoint returns the error associated with a user-facing self service errors. \nThis endpoint supports stub values to help you implement the error UI: ?error=stub:500 - returns a stub 500 (Internal Server Error) error.",
            args: {
                error: { type: GraphQLNonNull(GraphQLString), description: "Error is the container's ID" }
            },
            resolve: getErrorContainerResolver
        },
    })
});
