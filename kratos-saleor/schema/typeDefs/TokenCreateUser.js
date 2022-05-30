const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "tokenCreateUser",
    fields: () => ({
            id: { type: GraphQLString },
            email: { type: GraphQLString },
            firstName: { type: GraphQLString },
            lastName: { type: GraphQLString },
            isStaff: { type: GraphQLBoolean },
            __typename: { type: GraphQLString }
    })
});