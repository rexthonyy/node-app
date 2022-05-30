const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLID
} = require("graphql");

// data types
const Country = require("./Country");

module.exports = new GraphQLObjectType({
    name: "Address",
    description: "Represents user address data.",
    fields: () => ({
            id: { type: GraphQLNonNull(GraphQLID) },
            firstName: { type: GraphQLString },
            lastName: { type: GraphQLString },
            companyName: { type: GraphQLString },
            streetAddress1: { type: GraphQLString },
            streetAddress2: { type: GraphQLString },
            city: { type: GraphQLString },
            cityArea: { type: GraphQLString },
            postalCode: { type: GraphQLString },
            country: { type: Country },
            countryArea: { type: GraphQLString },
            phone: { type: GraphQLString },
            isDefaultShippingAddress: { type: GraphQLBoolean },
            isDefaultBillingAddress: { type: GraphQLBoolean }
    })
});