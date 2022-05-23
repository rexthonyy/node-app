const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLInt
} = require("graphql");

// data types
const UiText = require("./UiText");

module.exports = new GraphQLObjectType({
    name: "UiNodeAttributes_",
    fields: () => ({
        type: { type: GraphQLString }
    })
});