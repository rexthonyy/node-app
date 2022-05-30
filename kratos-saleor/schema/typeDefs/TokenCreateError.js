const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "tokenCreateError",
    fields: () => ({
            code: { type: GraphQLString },
            field: { type: GraphQLString },
            message: { type: GraphQLString },
            __typename: { type: GraphQLString }
    })
});