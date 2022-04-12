const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} = require("graphql");

// data types
const ForumType = require("./ForumType");

// resolvers
const getForumsResolver = require("../resolvers/getForumsResolver");


module.exports = new GraphQLObjectType({
    name: "Query",
    description: 'Root Query',
    fields: () => ({
        ping: {
            type: GraphQLString,
            resolve: () => "pong"
        },
        getForums_: {
            type: GraphQLList(ForumType),
            description: "Returns the list of forums",
            resolve: getForumsResolver
        }
    })
});
