const {
    GraphQLObjectType,
    GraphQLString
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "Query",
    description: 'Root Query',
    fields: () => ({
        ping: {
            type: GraphQLString,
            resolve: () => "pong"
        }
    })
});
