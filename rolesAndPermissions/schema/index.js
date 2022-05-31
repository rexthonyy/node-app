const { loadSchemaSync } = require('@graphql-tools/load');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');
const { addResolversToSchema } = require('@graphql-tools/schema');
const resolvers = require("./resolvers");
const schema = loadSchemaSync("schema.graphql", {
    loaders: [new GraphQLFileLoader()]
});

module.exports = addResolversToSchema({
    schema,
    resolvers
});