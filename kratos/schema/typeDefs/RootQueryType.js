const {
    GraphQLNonNull,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLBoolean
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
const Version = require("./Version");
const SettingsFlow = require("./SettingsFlow");
const Session = require("./Session");

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
const getJSONSchemaResolver = require("../resolvers/getJSONSchemaResolver");
const getLoginFlowResolver = require("../resolvers/getLoginFlowResolver");
const getRecoveryFlowResolver = require("../resolvers/getRecoveryFlowResolver");
const getRegistrationFlowResolver = require("../resolvers/getRegistrationFlowResolver");
const getVerificationFlowResolver = require("../resolvers/getVerificationFlowResolver");
const getVersionResolver = require("../resolvers/getVersionResolver");
const getSelfServiceSettingsFlowResolver = require("../resolvers/getSelfServiceSettingsFlowResolver");
const getSessionResolver = require("../resolvers/getSessionResolver");
const getSettingsFlowResolver = require("../resolvers/getSettingsFlowResolver");

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
                error: { type: GraphQLNonNull(GraphQLString), description: "Error is the container's ID" }
            },
            resolve: getErrorContainerResolver
        },
        getSelfServiceLoginFlow_: {
            type: LoginFlow,
            description: "This endpoint returns a login flow's context with, for example, error details and other information.",
            args: {
                id: { type: GraphQLNonNull(GraphQLString), description: "The Login Flow ID\n\nThe value for this parameter comes from flow URL Query parameter sent to your application (e.g. /login?flow=abcde)." }
            },
            resolve: getSelfServiceLoginFlowResolver
        },
        getSelfServiceRecoveryFlow_: {
            type: RecoveryFlow,
            description: "This endpoint returns a recovery flow's context with, for example, error details and other information.",
            args: {
                id: { type: GraphQLNonNull(GraphQLString), description: "The Flow ID\n\nThe value for this parameter comes from request URL Query parameter sent to your application (e.g. /recovery?flow=abcde)." }
            },
            resolve: getSelfServiceRecoveryFlowResolver
        },
        getSelfServiceRegistrationFlow_: {
            type: RegistrationFlow,
            description: "This endpoint returns a registration flow's context with, for example, error details and other information.",
            args: {
                id: { type: GraphQLNonNull(GraphQLString), description: "The Registration Flow ID\n\nThe value for this parameter comes from flow URL Query parameter sent to your application `(e.g. /registration?flow=abcde)`." }
            },
            resolve: getSelfServiceRegistrationFlowResolver
        },
        getSelfServiceVerificationFlow_: {
            type: VerificationFlow,
            description: "This endpoint returns a verification flow's context with, for example, error details and other information.",
            args: {
                id: { type: GraphQLNonNull(GraphQLString), description: "The Flow ID\n\nThe value for this parameter comes from request URL Query parameter sent to your application `(e.g. /verification?flow=abcde)`." }
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
                page: { type: GraphQLInt, description: "Pagination Page" }, 
                perPage: { type: GraphQLInt, description: "Items per Page\n\nThis is the number of items per page." }
            },
            resolve: getIdentitiesResolver
        },
        identity_: {
            type: Identity,
            args: {
                id: { type: GraphQLNonNull(GraphQLString), description: "ID must be set to the ID of identity you want to get" }
            },
            resolve: getIdentityResolver
        },
        jsonSchema_: {
            type: GraphQLString,
            args: {
                id: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: getJSONSchemaResolver
        },
        loginFlow_: {
            type: LoginFlow,
            description: "This endpoint initiates a login flow for API clients such as mobile devices, smart TVs, and so on.\n\nIf a valid provided session cookie or session token is provided, a 400 Bad Request error will be returned unless the URL query parameter ?refresh=true is set.\n\nTo fetch an existing login flow call /self-service/login/flows?flow=<flow_id>.\n\n:::warning\n\nYou MUST NOT use this endpoint in client-side (Single Page Apps, ReactJS, AngularJS) nor server-side (Java Server Pages, NodeJS, PHP, Golang, ...) browser applications. Using this endpoint in these applications will make you vulnerable to a variety of CSRF attacks, including CSRF login attacks.\n\nThis endpoint MUST ONLY be used in scenarios such as native mobile apps (React Native, Objective C, Swift, Java, ...).\n\n:::\n\nMore information can be found at Ory Kratos User Login and User Registration Documentation.\n\nEquivalent to Ory Kratos API GET /self-service/login/api",
            args: {
                refresh: { type: GraphQLBoolean }
            },
            resolve: getLoginFlowResolver
        },
        recoveryFlow_: {
            type: RecoveryFlow,
            description: "This endpoint initiates a recovery flow for API clients such as mobile devices, smart TVs, and so on.\n\nIf a valid provided session cookie or session token is provided, a 400 Bad Request error.\n\nTo fetch an existing recovery flow call /self-service/recovery/flows?flow=<flow_id>.\n\n:::warning\n\nYou MUST NOT use this endpoint in client-side (Single Page Apps, ReactJS, AngularJS) nor server-side (Java Server Pages, NodeJS, PHP, Golang, ...) browser applications. Using this endpoint in these applications will make you vulnerable to a variety of CSRF attacks.\n\nThis endpoint MUST ONLY be used in scenarios such as native mobile apps (React Native, Objective C, Swift, Java, ...).\n\n:::\n\nMore information can be found at Ory Kratos Account Recovery Documentation.\n\nEquivalent to Ory Kratos API GET /self-service/recovery/api",
            resolve: getRecoveryFlowResolver
        },
        registrationFlow_: {
            type: RecoveryFlow,
            description: "This endpoint initiates a registration flow for API clients such as mobile devices, smart TVs, and so on.\n\nIf a valid provided session cookie or session token is provided, a 400 Bad Request error will be returned unless the URL query parameter ?refresh=true is set.To fetch an existing registration flow call /self-service/registration/flows?flow=<flow_id>.\n\n:::warning\n\nYou MUST NOT use this endpoint in client-side (Single Page Apps, ReactJS, AngularJS) nor server-side (Java Server Pages, NodeJS, PHP, Golang, ...) browser applications. Using this endpoint in these applications will make you vulnerable to a variety of CSRF attacks.\n\nThis endpoint MUST ONLY be used in scenarios such as native mobile apps (React Native, Objective C, Swift, Java, ...).\n\n:::\n\nMore information can be found at Ory Kratos User Login and User Registration Documentation.\n\nEquivalent to Ory Kratos API GET /self-service/registration/api",
            resolve: getRegistrationFlowResolver
        },
        verificationFlow_: {
            type: VerificationFlow,
            description: "This endpoint initiates a verification flow for API clients such as mobile devices, smart TVs, and so on.\n\nTo fetch an existing verification flow call /self-service/verification/flows?flow=<flow_id>.\n\n:::warning\n\nYou MUST NOT use this endpoint in client-side (Single Page Apps, ReactJS, AngularJS) nor server-side (Java Server Pages, NodeJS, PHP, Golang, ...) browser applications. Using this endpoint in these applications will make you vulnerable to a variety of CSRF attacks.\n\nThis endpoint MUST ONLY be used in scenarios such as native mobile apps (React Native, Objective C, Swift, Java, ...).\n\n:::\n\nMore information can be found at Ory Kratos Email and Phone Verification Documentation.\n\nEquivalent to Ory Kratos API GET /self-service/verification/api",
            resolve: getVerificationFlowResolver
        },
        version_: {
            type: Version,
            description: "This endpoint returns the version of Ory Kratos.\n\nIf the service supports TLS Edge Termination, this endpoint does not require the X-Forwarded-Proto header to be set.\n\nBe aware that if you are running multiple nodes of this service, the version will never refer to the cluster state, only to a single instance.\n\nEquivalent to Ory Kratos API GET /version",
            resolve: getVersionResolver
        },
        getSelfServiceSettingsFlow_: {
            type: SettingsFlow,
            description: "When accessing this endpoint through Ory Kratos' Public API you must ensure that either the Ory Kratos Session Cookie or the Ory Kratos Session Token are set. The public endpoint does not return 404 status codes but instead 403 or 500 to improve data privacy.\n\nYou can access this endpoint without credentials when using Ory Kratos' Admin API.\n\nMore information can be found at Ory Kratos User Settings & Profile Management Documentation.\n\nEquivalent to Ory Kratos API GET /self-service/settings/flows",
            args: {
                id: { type: GraphQLString }            
            },
            resolve: getSelfServiceSettingsFlowResolver
        },
        session_: {
            type: Session,
            description: "Uses the HTTP Headers in the GET request to determine (e.g. by using checking the cookies) who is authenticated. Returns a session object in the body or 401 if the credentials are invalid or no credentials were sent. Additionally when the request it successful it adds the user ID to the 'X-Kratos-Authenticated-Identity-Id' header in the response.\n\nThis endpoint is useful for reverse proxies and API Gateways.\n\nEquivalent to Ory Kratos API GET /sessions/whoami",
            args: {
                authorization: { type: GraphQLString },
                cookie: { type: GraphQLString },
            },
            resolve: getSessionResolver
        },
        settingsFlow_: {
            type: SettingsFlow,
            description: "This endpoint initiates a settings flow for API clients such as mobile devices, smart TVs, and so on. You must provide a valid Ory Kratos Session Token for this endpoint to respond with HTTP 200 OK.\n\nTo fetch an existing settings flow call /self-service/settings/flows?flow=<flow_id>.\n\n:::warning\n\nYou MUST NOT use this endpoint in client-side (Single Page Apps, ReactJS, AngularJS) nor server-side (Java Server Pages, NodeJS, PHP, Golang, ...) browser applications. Using this endpoint in these applications will make you vulnerable to a variety of CSRF attacks.\n\nThis endpoint MUST ONLY be used in scenarios such as native mobile apps (React Native, Objective C, Swift, Java, ...).\n\n:::\n\nMore information can be found at Ory Kratos User Settings & Profile Management Documentation.\n\nEquivalent to Ory Kratos API GET /self-service/settings/api",
            resolve: getSettingsFlowResolver
        }
    })
});
