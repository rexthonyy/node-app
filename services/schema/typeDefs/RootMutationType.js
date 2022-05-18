const {
    GraphQLObjectType,
    GraphQLList,
    GraphQLString,
    GraphQLNonNull
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "Mutation",
    description: 'Root Mutation',
    fields: () => ({
        ping: {
            type: GraphQLString,
            resolve: () => "pong"
        }
    })
});
