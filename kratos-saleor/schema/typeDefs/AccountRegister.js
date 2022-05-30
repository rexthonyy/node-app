const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean
} = require("graphql");

// data types
const AccountError = require("./AccountError");
const User = require("./User");

module.exports = new GraphQLObjectType({
    name: "AccountRegister",
    fields: () => ({
            requiresConfirmation: { type: GraphQLBoolean },
            errors: { type: GraphQLList(AccountError) },
            user: { type: User }
    })
});