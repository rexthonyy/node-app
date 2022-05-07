const {
    GraphQLString,
    GraphQLNonNull,
    GraphQLObjectInputType,
} = require("graphql");

const V1ZedTokenInput = require("./V1ZedTokenInput");

module.exports = new GraphQLObjectInputType({
    name: "V1ConsistencyInput_",
    description: "Consistency will define how a request is handled by the backend. By defining a consistency requirement, and a token at which those requirements should be applied, where applicable.",
    fields: () => ({
        atExactSnapshot: { type: V1ZedTokenInput, description: "ZedToken is used to provide causality metadata between Write and Check requests.\n\nSee the authzed.api.v1.Consistency message for more information." },
        atLeastAsFresh: { type: V1ZedTokenInput, description: "ZedToken is used to provide causality metadata between Write and Check requests.\n\nSee the authzed.api.v1.Consistency message for more information." },
        fullyConsistent: { type: GraphQLBoolean, description: "fully_consistent indicates that all data used in the API call must be at the most recent snapshot found.\n\nNOTE: using this method can be quite slow, so unless there is a need to do so, it is recommended to use `at_least_as_fresh` with a stored ZedToken." },
        minimizeLatency: { type: GraphQLBoolean, description: "minimize_latency indicates that the latency for the call should be minimized by having the system select the fastest snapshot available." }
    })
});