const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLNonNull
} = require("graphql");

// data types
const LoginViaApiResponse = require("./LoginViaApiResponse");
const CompleteSelfServiceLoginFlowWithPasswordMethodInput = require("./CompleteSelfServiceLoginFlowWithPasswordMethodInput");
const RegistrationViaApiResponse = require("./RegistrationViaApiResponse");
const Identity = require("./Identity");
const CreateIdentityInput = require("./CreateIdentityInput");
const RecoveryLink = require("./RecoveryLink");
const CreateRecoveryLinkInput = require("./CreateRecoveryLinkInput");
const UpdateIdentityInput = require("./UpdateIdentityInput");
const SettingsViaApiResponse = require("./SettingsViaApiResponse");
const CompleteSelfServiceSettingsFlowWithPasswordMethodInput = require("./CompleteSelfServiceSettingsFlowWithPasswordMethodInput");
const SettingsFlow = require("./SettingsFlow");

// resolvers
const executeCompleteSelfServiceLoginFlowWithPasswordMethodResolver = require("../resolvers/executeCompleteSelfServiceLoginFlowWithPasswordMethodResolver");
const executeCompleteSelfServiceRegistrationFlowWithPasswordMethodResolver = require("../resolvers/executeCompleteSelfServiceRegistrationFlowWithPasswordMethodResolver");
const executeCreateIdentityResolver = require("../resolvers/executeCreateIdentityResolver");
const executeCreateRecoveryLinkResolver = require("../resolvers/executeCreateRecoveryLinkResolver");
const executeUpdateIdentityResolver = require("../resolvers/executeUpdateIdentityResolver");
const executeCompleteSelfServiceSettingsFlowWithPasswordMethodResolver = require("../resolvers/executeCompleteSelfServiceSettingsFlowWithPasswordMethodResolver");
const executeCompleteSelfServiceSettingsFlowWithProfileMethodResolver = require("../resolvers/executeCompleteSelfServiceSettingsFlowWithProfileMethodResolver");
const executeComplete2FAResolver = require("../resolvers/executeComplete2FAResolver");

module.exports = new GraphQLObjectType({
    name: "Mutation",
    description: 'Root Mutation',
    fields: () => ({
        ping: {
            type: GraphQLString,
            resolve: () => "pong"
        },
        completeSelfServiceLoginFlowWithPasswordMethod_: {
            type: LoginViaApiResponse,
            description: "Use this endpoint to complete a login flow by sending an identity's identifier and password. This endpoint behaves differently for API and browser flows.\n\nAPI flows expect application/json to be sent in the body and responds with HTTP 200 and a application/json body with the session token on success; HTTP 302 redirect to a fresh login flow if the original flow expired with the appropriate error messages set; HTTP 400 on form validation errors.\n\nBrowser flows expect application/x-www-form-urlencoded to be sent in the body and responds with a HTTP 302 redirect to the post/after login URL or the return_to value if it was set and if the login succeeded; a HTTP 302 redirect to the login UI URL with the flow ID containing the validation errors otherwise.\n\nMore information can be found at Ory Kratos User Login and User Registration Documentation.\n\nEquivalent to Ory Kratos API POST /self-service/login/methods/password",
            args: {
                completeSelfServiceLoginFlowWithPasswordMethodInput: { type: CompleteSelfServiceLoginFlowWithPasswordMethodInput },
                flow: { type: GraphQLNonNull(GraphQLString), description: "The Flow ID" }
            },
            resolve: executeCompleteSelfServiceLoginFlowWithPasswordMethodResolver
        },
        completeSelfServiceRegistrationFlowWithPasswordMethod_: {
            type: RegistrationViaApiResponse,
            description: "Use this endpoint to complete a registration flow by sending an identity's traits and password. This endpoint behaves differently for API and browser flows.\n\nAPI flows expect application/json to be sent in the body and respond with HTTP 200 and a application/json body with the created identity success - if the session hook is configured the session and session_token will also be included; HTTP 302 redirect to a fresh registration flow if the original flow expired with the appropriate error messages set; HTTP 400 on form validation errors.\n\nBrowser flows expect application/x-www-form-urlencoded to be sent in the body and responds with a HTTP 302 redirect to the post/after registration URL or the return_to value if it was set and if the registration succeeded; a HTTP 302 redirect to the registration UI URL with the flow ID containing the validation errors otherwise.\n\nMore information can be found at Ory Kratos User Login and User Registration Documentation.\n\nEquivalent to Ory Kratos API POST /self-service/registration/methods/password",
            args: {
                flow: { type: GraphQLString },
                selfServiceRegistrationMethodsPasswordInput: { type: GraphQLString },
            },
            resolve: executeCompleteSelfServiceRegistrationFlowWithPasswordMethodResolver
        },
        createIdentity_: {
            type: Identity,
            description: "This endpoint creates an identity. It is NOT possible to set an identity's credentials (password, ...) using this method! A way to achieve that will be introduced in the future.\n\nLearn how identities work in Ory Kratos' User And Identity Model Documentation.\n\nEquivalent to Ory Kratos API POST /identities",
            args: {
                createIdentityInput: { type: CreateIdentityInput }
            },
            resolve: executeCreateIdentityResolver
        },
        createRecoveryLink_: {
            type: RecoveryLink,
            description: "This endpoint creates a recovery link which should be given to the user in order for them to recover (or activate) their account.\n\nEquivalent to Ory Kratos API POST /recovery/link",
            args: {
                createRecoveryLinkInput: { type: CreateRecoveryLinkInput }
            },
            resolve: executeCreateRecoveryLinkResolver
        },
        updateIdentity_: {
            type: Identity,
            description: "This endpoint updates an identity. It is NOT possible to set an identity's credentials (password, ...) using this method! A way to achieve that will be introduced in the future.\n\nThe full identity payload (except credentials) is expected. This endpoint does not support patching.\n\nLearn how identities work in Ory Kratos' User And Identity Model Documentation.\n\nEquivalent to Ory Kratos API PUT /identities/{id}",
            args: {
                id: { type: GraphQLNonNull(GraphQLString) },
                updateIdentityInput: { type: UpdateIdentityInput }
            },
            resolve: executeUpdateIdentityResolver
        },
        completeSelfServiceSettingsFlowWithPasswordMethod_: {
            type: SettingsViaApiResponse,
            description: "Use this endpoint to complete a settings flow by sending an identity's updated password. This endpoint behaves differently for API and browser flows.\n\nAPI-initiated flows expect application/json to be sent in the body and respond with HTTP 200 and an application/json body with the session token on success; HTTP 302 redirect to a fresh settings flow if the original flow expired with the appropriate error messages set; HTTP 400 on form validation errors. HTTP 401 when the endpoint is called without a valid session token. HTTP 403 when selfservice.flows.settings.privileged_session_max_age was reached. Implies that the user needs to re-authenticate.\n\nBrowser flows expect application/x-www-form-urlencoded to be sent in the body and responds with a HTTP 302 redirect to the post/after settings URL or the return_to value if it was set and if the flow succeeded; a HTTP 302 redirect to the Settings UI URL with the flow ID containing the validation errors otherwise. a HTTP 302 redirect to the login endpoint when selfservice.flows.settings.privileged_session_max_age was reached.\n\nMore information can be found at Ory Kratos User Settings & Profile Management Documentation.\n\nEquivalent to Ory Kratos API POST /self-service/settings/methods/password",
            args: {
                completeSelfServiceSettingsFlowWithPasswordMethodInput: { type: CompleteSelfServiceSettingsFlowWithPasswordMethodInput },
                flow: { type: GraphQLString },
            },
            resolve: executeCompleteSelfServiceSettingsFlowWithPasswordMethodResolver
        },
        completeSelfServiceSettingsFlowWithProfileMethod_: {
            type: SettingsFlow,
            description: "Use this endpoint to complete a settings flow by sending an identity's updated traits. This endpoint behaves differently for API and browser flows.\n\nAPI-initiated flows expect application/json to be sent in the body and respond with HTTP 200 and an application/json body with the session token on success; HTTP 302 redirect to a fresh settings flow if the original flow expired with the appropriate error messages set; HTTP 400 on form validation errors. HTTP 401 when the endpoint is called without a valid session token. HTTP 403 when selfservice.flows.settings.privileged_session_max_age was reached and a sensitive field was updated (e.g. recovery email). Implies that the user needs to re-authenticate.\n\nBrowser flows expect application/x-www-form-urlencoded to be sent in the body and responds with a HTTP 302 redirect to the post/after settings URL or the return_to value if it was set and if the flow succeeded; a HTTP 302 redirect to the settings UI URL with the flow ID containing the validation errors otherwise. a HTTP 302 redirect to the login endpoint when selfservice.flows.settings.privileged_session_max_age was reached.\n\nMore information can be found at Ory Kratos User Settings & Profile Management Documentation.\n\nEquivalent to Ory Kratos API POST /self-service/settings/methods/profile",
            args: {
                flow: { type: GraphQLString },
                selfServiceSettingsMethodsProfileInput: { type: GraphQLString }
            },
            resolve: executeCompleteSelfServiceSettingsFlowWithProfileMethodResolver
        },
        complete2FA_: {
            type: GraphQLString,
            args: {
                authenticationData: { type: GraphQLString }
            },
            resolve: executeComplete2FAResolver
        },
    })
});
