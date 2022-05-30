const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLID,
    GraphQLInt
} = require("graphql");


// data types
const VAT = require("./VAT");

module.exports = new GraphQLObjectType({
    name: "CountryDisplay",
    fields: () => ({
        code: { type: GraphQLNonNull(GraphQLString) },
        country: { type: GraphQLNonNull(GraphQLString) },
        VAT: { type: VAT }
    })
});