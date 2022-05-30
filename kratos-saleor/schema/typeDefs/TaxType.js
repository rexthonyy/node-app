const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLID
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "TaxType",
    description: "Representation of tax types fetched from tax gateway.",
    fields: () => ({
        description: { type: GraphQLString },
        taxCode: { type: GraphQLString }
    })
});