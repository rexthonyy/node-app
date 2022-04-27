const {
    GraphQLString,
    GraphQLNonNull,
    GraphQLInputObjectType
} = require("graphql");

module.exports = new GraphQLInputObjectType({
    name: "CreateIdentityInput_",
    fields: () => ({
            schemaId: { type: GraphQLNonNull(GraphQLString), description: "SchemaID is the ID of the JSON Schema to be used for validating the identity's traits." },
            traits: { type: GraphQLNonNull(GraphQLString), description: "Traits represent an identity's traits. The identity is able to create, modify, and delete traits in a self-service manner. The input will always be validated against the JSON Schema defined in `schema_url`." }
    })
});