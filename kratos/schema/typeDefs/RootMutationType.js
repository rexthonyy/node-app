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

// resolvers
const getCompleteSelfServiceLoginFlowWithPasswordMethodResolver = require("../resolvers/getCompleteSelfServiceLoginFlowWithPasswordMethodResolver");
const getCompleteSelfServiceRegistrationFlowWithPasswordMethodResolver = require("../resolvers/getCompleteSelfServiceRegistrationFlowWithPasswordMethodResolver");

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
                flow: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: getCompleteSelfServiceLoginFlowWithPasswordMethodResolver
        },
        completeSelfServiceRegistrationFlowWithPasswordMethod_: {
            type: RegistrationViaApiResponse,
            description: "Use this endpoint to complete a registration flow by sending an identity's traits and password. This endpoint behaves differently for API and browser flows.\n\nAPI flows expect application/json to be sent in the body and respond with HTTP 200 and a application/json body with the created identity success - if the session hook is configured the session and session_token will also be included; HTTP 302 redirect to a fresh registration flow if the original flow expired with the appropriate error messages set; HTTP 400 on form validation errors.\n\nBrowser flows expect application/x-www-form-urlencoded to be sent in the body and responds with a HTTP 302 redirect to the post/after registration URL or the return_to value if it was set and if the registration succeeded; a HTTP 302 redirect to the registration UI URL with the flow ID containing the validation errors otherwise.\n\nMore information can be found at Ory Kratos User Login and User Registration Documentation.\n\nEquivalent to Ory Kratos API POST /self-service/registration/methods/password",
            args: {
                flow: { type: GraphQLString },
                selfServiceRegistrationMethodsPasswordInput: { type: GraphQLString },
            },
            resolve: getCompleteSelfServiceRegistrationFlowWithPasswordMethodResolver
        },
    })
});
