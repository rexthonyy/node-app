const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLNonNull
} = require("graphql");

//typedefs
const StatusMessageResponseType = require("./StatusMessageResponseType");

// resolvers
const addTagResolver = require("../resolvers/addTagResolver");

module.exports = new GraphQLObjectType({
    name: "Mutation",
    description: 'Root Mutation',
    fields: () => ({
        ping: {
            type: GraphQLString,
            resolve: () => "pong"
        },
        addTag_: {
            type: StatusMessageResponseType,
            description: "Adds a tag",
            args: {
                item: { type: GraphQLNonNull(GraphQLString) },
                object: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: addTagResolver
        },
    })
});
