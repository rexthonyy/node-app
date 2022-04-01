const {
    GraphQLObjectType,
    GraphQLString
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "Response",
    description: "An object which is used to return status messages for static responses",
    fields: () => ({
            status: { type: GraphQLString },
            message: { type: GraphQLString }
    })
});