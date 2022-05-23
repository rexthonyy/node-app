const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList
} = require("graphql");

// data types
const VerifiableAddress = require("./VerifiableAddress");
const RecoveryAddress = require("./RecoveryAddress");

module.exports = new GraphQLObjectType({
    name: "Identity_",
    fields: () => ({
            id: { type: GraphQLNonNull(GraphQLString) },
            recoveryAddresses: { type: GraphQLList(RecoveryAddress), description: "RecoveryAddresses contains all the addresses that can be used to recover an identity." },
            schemaId: { type: GraphQLNonNull(GraphQLString), description: "SchemaID is the ID of the JSON Schema to be used for validating the identity's traits." },
            schemaUrl: { type: GraphQLNonNull(GraphQLString), description: "SchemaURL is the URL of the endpoint where the identity's traits schema can be fetched from.\n\nformat: url" },
            traits: { type: GraphQLNonNull(GraphQLString) },
            verifiableAddresses: { type: GraphQLList(VerifiableAddress), description: "VerifiableAddresses contains all the addresses that can be verified by the user." }
    })
});