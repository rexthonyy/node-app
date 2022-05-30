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
const MetadataItem = require("./MetadataItem");
const Checkout = require("./Checkout");
const Order = require("./Order");
const Transaction = require("./Transaction");
const CreditCard = require("./CreditCard");
const Money = require("./Money");

module.exports = new GraphQLObjectType({
    name: "Payment",
    description: "Represents a payment of a given type",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        privateMetadata: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MetadataItem))) },
        privateMetaField: { type: GraphQLString },
        privateMetaFields: { type: GraphQLString },
        metadata: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MetadataItem))) },
        metafield: { type: GraphQLString },
        metafields: { type: GraphQLString },
        gateway: { type: GraphQLNonNull(GraphQLString) },
        isActive: { type: GraphQLNonNull(GraphQLBoolean) },
        created: { type: GraphQLNonNull(GraphQLString) },
        modified: { type: GraphQLNonNull(GraphQLString) },
        token: { type: GraphQLNonNull(GraphQLString) },
        checkout: { type: Checkout },
        order: { type: Order },
        paymentMethodType: { type: GraphQLNonNull(GraphQLString) },
        customerIpAddress: { type: GraphQLString },
        chargeStatus: { type: GraphQLNonNull(GraphQLString) },
        actions: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLString))) },
        total: { type: Money },
        capturedAmount: { type: Money },
        transactions: { type: GraphQLList(GraphQLNonNull(Transaction)) },
        availableCaptureAmount: { type: Money },
        availableRefundAmount: { type: Money },
        creditCard: { type: CreditCard }
    })
});