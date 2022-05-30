const {
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLID,
    GraphQLInt
} = require("graphql");


module.exports = new GraphQLInputObjectType({
    name: "AddressInput",
    fields: () => ({
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        companyName: { type: GraphQLString },
        streetAddress1: { type: GraphQLString },
        streetAddress2: { type: GraphQLString },
        city: { type: GraphQLString },
        cityArea: { type: GraphQLString },
        postalCode: { type: GraphQLString },
        country: { type: GraphQLString },
        countryArea: { type: GraphQLString },
        phone: { type: GraphQLString }
    })
});