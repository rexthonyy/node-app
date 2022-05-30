const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "AccountRegister",
    fields: () => ({
            field: { type: GraphQLString },
            message: { type: GraphQLString },
            code: { type: GraphQLString },
            addressType: { type: GraphQLString }
    })
});