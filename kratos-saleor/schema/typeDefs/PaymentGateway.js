const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLInt,
    GraphQLID,
    GraphQLFloat
} = require("graphql");

// data types
const GatewayConfigLine = require("./GatewayConfigLine");

module.exports = new GraphQLObjectType({
    name: "PaymentGateway",
    description: "Available payment gateway backend with configuration necessary to setup client.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        config: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GatewayConfigLine))) },
        currencies: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLString))) }
    })
});