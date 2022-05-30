const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList
} = require("graphql");

// data types
const TokenCreateError = require("./TokenCreateError");
const TokenCreateUser = require("./TokenCreateUser");

module.exports = new GraphQLObjectType({
    name: "tokenCreate",
    fields: () => ({
            csrfToken: { type: GraphQLString },
            token: { type: GraphQLString },
            errors: { type: GraphQLList(TokenCreateError) },
            user: { type: TokenCreateUser },
            __typename: { type: GraphQLString }
    })
});