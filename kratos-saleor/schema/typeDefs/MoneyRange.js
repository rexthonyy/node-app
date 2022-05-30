const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLID
} = require("graphql");


// data types
const Money = require("./Money");

module.exports = new GraphQLObjectType({
    name: "MoneyRange",
    description: "Represents a range of amounts of money.",
    fields: () => ({
        start: { type: Money },
        stop: { type: Money }
    })
});