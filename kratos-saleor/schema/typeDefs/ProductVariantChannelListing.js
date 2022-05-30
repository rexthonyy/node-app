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
const Channel = require("./Channel");
const Money = require("./Money");
const PreorderThreshold = require("./PreorderThreshold");

module.exports = new GraphQLObjectType({
    name: "ProductVariantChannelListing",
    description: "Represents product varaint channel listing.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        channel: { type: GraphQLNonNull(Channel) },
        price: { type: Money },
        costPrice: { type: Money },
        margin: { type: GraphQLInt },
        preorderThreshold: { type: PreorderThreshold }
    })
});