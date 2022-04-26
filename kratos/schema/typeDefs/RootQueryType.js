const {
    GraphQLNonNull,
    GraphQLInt,
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
const HealthAlive = require("./HealthAlive");
const HealthReady = require("./HealthReady");
const Identity = require("./Identity");

// resolvers
const getErrorContainerResolver = require("../resolvers/getErrorContainerResolver");
const getSelfServiceLoginFlowResolver = require("../resolvers/getSelfServiceLoginFlowResolver");
const getSelfServiceRecoveryFlowResolver = require("../resolvers/getSelfServiceRecoveryFlowResolver");
const getSelfServiceRegistrationFlowResolver = require("../resolvers/getSelfServiceRegistrationFlowResolver");
const getSelfServiceVerificationFlowResolver = require("../resolvers/getSelfServiceVerificationFlowResolver");
const getHealthAliveResolver = require("../resolvers/getHealthAliveResolver");
const getHealthReadyResolver = require("../resolvers/getHealthReadyResolver");
const getIdentitiesResolver = require("../resolvers/getIdentitiesResolver");
const getIdentityResolver = require("../resolvers/getIdentityResolver");

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
        healthAlive_: {
            type: HealthAlive,
            description: "This endpoint returns a HTTP 200 status code when Ory Kratos is accepting incoming HTTP requests. This status does currently not include checks whether the database connection is working.\n\nIf the service supports TLS Edge Termination, this endpoint does not require the X-Forwarded-Proto header to be set.\n\nBe aware that if you are running multiple nodes of this service, the health status will never refer to the cluster state, only to a single instance.\n\nEquivalent to Ory Kratos API GET /health/alive",
            resolve: getHealthAliveResolver
        },
        healthReady_: {
            type: HealthReady,
            description: "This endpoint returns a HTTP 200 status code when Ory Kratos is up running and the environment dependencies (e.g. the database) are responsive as well.\n\nIf the service supports TLS Edge Termination, this endpoint does not require the `X-Forwarded-Proto` header to be set.\n\nBe aware that if you are running multiple nodes of Ory Kratos, the health status will never refer to the cluster state, only to a single instance.\n\nEquivalent to Ory Kratos API GET /health/ready",
            resolve: getHealthReadyResolver
        },
        identities_: {
            type: GraphQLList(Identity),
            description: "Lists all identities. Does not support search at the moment.",
            args: {
                page: { type: GraphQLInt }, 
                perPage: { type: GraphQLInt }
            },
            resolve: getIdentitiesResolver
        },
        identity_: {
            type: Identity,
            args: {
                id: { type: GraphQLString }
            },
            resolve: getIdentityResolver
        },
    })
});
