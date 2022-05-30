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
const TaxedMoney = require("./TaxedMoney");
const Warehouse = require("./Warehouse");
const Address = require("./Address");
const GiftCard = require("./GiftCard");
const Money = require("./Money");
const User = require("./User");
const Channel = require("./Channel");
const Fulfillment = require("./Fulfillment");
const Orderline = require("./Orderline");
const ShippingMethod = require("./ShippingMethod");
const Invoice = require("./Invoice");
const Payment = require("./Payment");
const Voucher = require("./Voucher");
const Weight = require("./Weight");
const OrderEvent = require("./OrderEvent");
const DeliveryMethod = require("./DeliveryMethod");
const OrderDiscount = require("./OrderDiscount");
const OrderError = require("./OrderError");

module.exports = new GraphQLObjectType({
    name: "Order",
    description: "Represents an order in the shop.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        privateMetadata: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MetadataItem))) },
        privateMetaField: { type: GraphQLString },
        privateMetaFields: { type: GraphQLString },
        metadata: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MetadataItem))) },
        metafield: { type: GraphQLString },
        metafields: { type: GraphQLString },
        created: { type: GraphQLNonNull(GraphQLString) },
        updatedAt: { type: GraphQLNonNull(GraphQLString) },
        status: { type: GraphQLNonNull(GraphQLString) },
        user: { type: GraphQLNonNull(User) },
        trackingClientId: { type: GraphQLNonNull(GraphQLString) },
        billingAddress: { type: Address },
        shippingAddress: { type: Address },
        shippingMethodName: { type: GraphQLString },
        collectionPointName: { type: GraphQLString },
        channel: { type: GraphQLNonNull(Channel) },
        fulfillments: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(Fulfillment))) },
        lines: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(Orderline))) },
        actions: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLString))) },
        shippingMethods: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(ShippingMethod))) },
        availableCollectionPoints: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(Warehouse))) },
        invoices: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(Invoice))) },
        number: { type: GraphQLNonNull(GraphQLString) },
        original: { type: GraphQLID },
        origin: { type: GraphQLNonNull(GraphQLString) },
        isPaid: { type: GraphQLNonNull(GraphQLBoolean) },
        paymentStatus: { type: GraphQLNonNull(GraphQLString) },
        paymentStatusDisplay: { type: GraphQLNonNull(GraphQLString) },
        payments: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(Payment))) },
        total: { type: GraphQLNonNull(TaxedMoney) },
        undiscountedTotal: { type: GraphQLNonNull(TaxedMoney) },
        shippingPrice: { type: GraphQLNonNull(TaxedMoney) },
        shippingTaxRate: { type: GraphQLNonNull(GraphQLFloat) },
        voucher: { type: Voucher },
        giftCards: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GiftCard))) },
        displayGrossPrices: { type: GraphQLNonNull(GraphQLBoolean) },
        customerNote: { type: GraphQLNonNull(GraphQLString) },
        weight: { type: GraphQLNonNull(Weight) },
        redirectUrl: { type: GraphQLString },
        subtotal: { type: GraphQLNonNull(TaxedMoney) },
        statusDisplay: { type: GraphQLNonNull(GraphQLString) },
        canFinalize: { type: GraphQLNonNull(GraphQLBoolean) },
        totalAuthorized: { type: GraphQLNonNull(Money) },
        totalCaptured: { type: GraphQLNonNull(Money) },
        events: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(OrderEvent))) },
        totalBalance: { type: GraphQLNonNull(Money) },
        userEmail: { type: GraphQLString },
        isShippingRequired: { type: GraphQLBoolean },
        deliveryMethod: { type: DeliveryMethod },
        languageCodeEnum: { type: GraphQLString },
        discounts: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(OrderDiscount))) },
        errors: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(OrderError))) },
        availableShippingMethods: { type: GraphQLList(ShippingMethods) },
        token: { type: GraphQLString },
        languageCode: { type: GraphQLString },
        discount: { type: Money },
        discountName: { type: GraphQLString },
        translatedDiscountName: { type: GraphQLString }
    })
});