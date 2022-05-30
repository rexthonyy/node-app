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

module.exports = new GraphQLObjectType({
    name: "GatewayConfigLine",
    description: "Payment gateway client configuration key and value pair.",
    fields: () => ({
        field: { type: GraphQLNonNull(GraphQLString) },
        value: { type: GraphQLString }
    })
});