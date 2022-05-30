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
const Channel = require("./Channel");
const PaymentGateway = require("./PaymentGateway");
const CheckoutLine = require("./CheckoutLine");
const Money = require("./Money");
const Address = require("./Address");
const ShippingMethod = require("./ShippingMethod");
const Warehouse = require("./Warehouse");
const GiftCard = require("./GiftCard");

module.exports = new GraphQLObjectType({
    name: "Checkout",
    description: "Checkout object.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        privateMetadata: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MetadataItem))) },
        privateMetaField: { type: GraphQLString },
        privateMetaFields: { type: GraphQLString },
        metadata: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MetadataItem))) },
        metafield: { type: GraphQLString },
        metafields: { type: GraphQLString },
        created: { type: GraphQLNonNull(GraphQLString) },
        lastChange: { type: GraphQLNonNull(GraphQLString) },
        user: { type: User },
        channel: { type: GraphQLNonNull(Channel) },
        billingAddress: { type: Address },
        shippingAddress: { type: Address },
        discount: { type: Money },
        discountName: { type: GraphQLString },
        translatedDiscountName: { type: GraphQLString },
        voucherCode: { type: GraphQLString },
        shippingMethods: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(ShippingMethod))) },
        avialbleCollectionPoints: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(Warehouse))) },
        availablePaymentGateways: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(PaymentGateway))) },
        email: { type: GraphQLString },
        giftCards: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GiftCard))) },
        isShippingRequired: { type: GraphQLNonNull(GraphQLBoolean) },
        quantity: { type: GraphQLNonNull(GraphQLInt) },
        stockReservationExpires: { type: GraphQLString },
        lines: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(CheckoutLine))) },
        shippingPrice: { type: GraphQLNonNull(TaxedMoney) },
        deliveryMethod: { type: GraphQLString },
        subtotalPrice: { type: GraphQLNonNull(TaxedMoney) },
        token: { type: GraphQLNonNull(GraphQLString) },
        totalPrice: { type: GraphQLNonNull(TaxedMoney) },
        languageCode: { type: GraphQLString },
        availableShippingMethods: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(ShippingMethod))) },
        shippingMethod: { type: ShippingMethod },
    })
});