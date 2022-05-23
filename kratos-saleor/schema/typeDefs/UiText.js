const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLID
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "UiText_",
    fields: () => ({
            context: { type: GraphQLString, description: "The message's context. Useful when customizing messages." },
            id: { type: GraphQLNonNull(GraphQLID) },
            text: { type: GraphQLNonNull(GraphQLString), description: "The message text. Written in american english." },
            type: { type: GraphQLNonNull(GraphQLString) }
            
    })
});