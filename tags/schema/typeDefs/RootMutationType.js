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
const removeTagResolver = require("../resolvers/removeTagResolver");

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
        removeTag_: {
            type: StatusMessageResponseType,
            description: "Deletes a tag",
            args: {
                item: { type: GraphQLNonNull(GraphQLString) },
                object: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: removeTagResolver
        }
    })
});
