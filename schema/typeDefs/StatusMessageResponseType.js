const {
    GraphQLObjectType,
    GraphQLString
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "Response",
    description: "Used to return status messages for static responses",
    fields: () => ({
            status: { type: GraphQLString },
            message: { type: GraphQLString }
    })
});