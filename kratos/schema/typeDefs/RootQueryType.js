const {
    GraphQLNonNull,
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} = require("graphql");

// data types
const ErrorContainer = require("./ErrorContainer");
const LoginFlow = require("./LoginFlow");
const RecoveryFlow = require("./RecoveryFlow");
const RegistrationFlow = require("./RegistrationFlow");
const VerificationFlow = require("./VerificationFlow");

// resolvers
const getErrorContainerResolver = require("../resolvers/getErrorContainerResolver");
const getSelfServiceLoginFlowResolver = require("../resolvers/getSelfServiceLoginFlowResolver");
const getSelfServiceRecoveryFlowResolver = require("../resolvers/getSelfServiceRecoveryFlowResolver");
const getSelfServiceRegistrationFlowResolver = require("../resolvers/getSelfServiceRegistrationFlowResolver");
const getSelfServiceVerificationFlowResolver = require("../resolvers/getSelfServiceVerificationFlowResolver");

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
            description: "This endpoint returns the error associated with a user-facing self service errors. \nThis endpoint supports stub values to help you implement the error UI: ?error=stub:500 - returns a stub 500 (Internal Server Error) error.",
            args: {
                error: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: getErrorContainerResolver
        },
        getSelfServiceLoginFlow_: {
            type: LoginFlow,
            description: "This endpoint returns a login flow's context with, for example, error details and other information.",
            args: {
                id: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: getSelfServiceLoginFlowResolver
        },
        getSelfServiceRecoveryFlow_: {
            type: RecoveryFlow,
            description: "This endpoint returns a recovery flow's context with, for example, error details and other information.",
            args: {
                id: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: getSelfServiceRecoveryFlowResolver
        },
        getSelfServiceRegistrationFlow_: {
            type: RegistrationFlow,
            description: "This endpoint returns a registration flow's context with, for example, error details and other information.",
            args: {
                id: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: getSelfServiceRegistrationFlowResolver
        },
        getSelfServiceVerificationFlow_: {
            type: VerificationFlow,
            description: "This endpoint returns a verification flow's context with, for example, error details and other information.",
            args: {
                id: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: getSelfServiceVerificationFlowResolver
        },
    })
});
