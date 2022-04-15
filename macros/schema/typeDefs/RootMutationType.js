const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLBoolean,
    GraphQLList,
    GraphQLNonNull
} = require("graphql");

//typedefs
const StatusMessageResponseType = require("./StatusMessageResponseType");

// resolvers
const createMacrosResolver = require("../resolvers/createMacrosResolver");

module.exports = new GraphQLObjectType({
    name: "Mutation",
    description: 'Root Mutation',
    fields: () => ({
        ping: {
            type: GraphQLString,
            resolve: () => "pong"
        },
        createMacros_: {
            type: StatusMessageResponseType,
            description: "Creates a macro",
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                group_ids: { type: GraphQLList(GraphQLID) },
                perform: { type: GraphQLNonNull(GraphQLString) },
                active: { type: GraphQLNonNull(GraphQLBoolean) },
                ux_flow_next_up: { type: GraphQLBoolean },
                note: { type: GraphQLString },
                updated_by_id: { type: GraphQLID },
                created_by_id: { type: GraphQLID },
                created_at: { type: GraphQLString },
                updated_at: { type: GraphQLString }

            },
            resolve: createMacrosResolver
        },
    })
});
