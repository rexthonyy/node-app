const {
    GraphQLNonNull,
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} = require("graphql");

//typedefs
const MacroType = require("./MacroType");

// resolvers
const getMacrosResolver = require("../resolvers/getMacrosResolver");

module.exports = new GraphQLObjectType({
    name: "Query",
    description: 'Root Query',
    fields: () => ({
        ping: {
            type: GraphQLString,
            resolve: () => "pong"
        },
        getMacros_: {
            type: GraphQLList(MacroType),
            description: "Get all macros",
            resolve: getMacrosResolver
        },
    })
});
