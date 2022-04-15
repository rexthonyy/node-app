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
const getMacroResolver = require("../resolvers/getMacroResolver");
const getMacroActionsResolver = require("../resolvers/getMacroActionsResolver");

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
        getMacro_: {
            type: MacroType,
            description: "Gets a macro",
            args: {
                macro_id: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve: getMacroResolver
        },
        getMacroActions_: {
            type: MacroActionType,
            description: "Gets all macro actions",
            resolve: getMacroActionsResolver
        },
    })
});
