const {
    GraphQLString,
    GraphQLNonNull,
    GraphQLJSON,
    GraphQLInputObjectType
} = require("graphql");

module.exports = new GraphQLInputObjectType({
    name: "UpdateIdentityInput_",
    fields: () => ({
            schemaId: { type: GraphQLString, description: "SchemaID is the ID of the JSON Schema to be used for validating the identity's traits. If set will update the Identity's SchemaID." },
            traits: { type: GraphQLNonNull(GraphQLString), description: "Traits represent an identity's traits. The identity is able to create, modify, and delete traits in a self-service manner. The input will always be validated against the JSON Schema defined in `schema_id`." }
    })
});