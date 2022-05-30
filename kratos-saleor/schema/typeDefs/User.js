const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLID
} = require("graphql");

// data types
const MetadataItem = require("./MetadataItem");
const Address = require("./Address");
const GiftCardCountableConnection = require("./GiftCardCountableConnection");
const OrderCountableConnection = require("./OrderCountableConnection");
const UserPermission = require("./UserPermission");
const Image = require("./Image");
const CustomerEvents = require("./CustomerEvents");
const PaymentSource = require("./PaymentSource");
const Checkout = require("./Checkout");

module.exports = new GraphQLObjectType({
    name: "User",
    description: "Represents user data.",
    fields: () => ({
            id: { type: GraphQLNonNull(GraphQLID) },
            privateMetadata: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MetadataItem))) },
            privateMetaField: { type: GraphQLString },
            privateMetaFields: { type: GraphQLString },
            metadata: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MetadataItem))) },
            metafield: { type: GraphQLString },
            metafields: { type: GraphQLString },
            email: { type: GraphQLString },
            firstName: { type: GraphQLString },
            lastName: { type: GraphQLString },
            isStaff: { type: GraphQLBoolean },
            isActive: { type: GraphQLBoolean },
            addresses: { type: GraphQLList(GraphQLNonNull(Address)) },
            checkOutTokens: { type: GraphQLList(GraphQLNonNull(GraphQLString)) },
            giftCards: { type: GiftCardCountableConnection },
            note: { type: GraphQLString },
            orders: { type: OrderCountableConnection },
            userPermissions: { type: GraphQLList(GraphQLNonNull(UserPermission)) },
            avatar: { type: Image },
            events: { type: GraphQLList(GraphQLNonNull(CustomerEvents)) },
            storedPaymentSources: { type: GraphQLList(GraphQLNonNull(PaymentSource)) },
            languageCodeEnum: { type: GraphQLNonNull(GraphQLString) },
            defaultShippingAddress: { type: Address },
            defaultBillingAddress: { type: Address },
            lastLogin: { type: GraphQLString },
            dateJoined: { type: GraphQLString },
            updatedAt: { type: GraphQLString },
            checkout: { type: Checkout }
    })
});