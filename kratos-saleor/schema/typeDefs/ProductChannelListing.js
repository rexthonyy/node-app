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
const Channel = require("./Channel");
const ProductPricingInfo = require("./ProductPricingInfo");
const Money = require("./Money");
const MoneyRange = require("./MoneyRange");
const Margin = require("./Margin");

module.exports = new GraphQLObjectType({
    name: "ProductChannelListing",
    description: "List of availability in channels for the product. Requires one of the following permissions: MANAGE_PRODUCTS.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        publishedAt: { type: GraphQLString },
        isPublished: { type: GraphQLNonNull(GraphQLBoolean) },
        channel: { type: GraphQLNonNull(Channel) },
        visibleInListings: { type: GraphQLNonNull(GraphQLBoolean) },
        availableForPurchaseAt: { type: GraphQLString },
        discountedPrice: { type: Money },
        purchaseCost: { type: MoneyRange },
        margin: { type: Margin },
        isAvailableForPurchase: { type: GraphQLBoolean },
        pricing: { type: ProductPricingInfo },
        publicationDate: { type: GraphQLString },
        availableForPurchase: { type: GraphQLString }
    })
});