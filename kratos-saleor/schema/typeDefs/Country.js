const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLID
} = require("graphql");

// data types
const VAT = require("./VAT");

module.exports = new GraphQLObjectType({
    name: "Country",
    description: "Shop's default country.",
    fields: () => ({
            code: { type: GraphQLNonNull(GraphQLString) },
            country: { type: GraphQLString },
            vat: { type: VAT }
    })
});