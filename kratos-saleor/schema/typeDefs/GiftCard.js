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
const User = require("./User");
const App = require("./App");
const Product = require("./Product");
const GiftCardEvent = require("./GiftCardEvent");
const GiftCardTag = require("./GiftCardTag");
const Money = require("./Money");

module.exports = new GraphQLObjectType({
    name: "GiftCard",
    description: "A gift card is a prepaid electronic payment card accepted in stores. They can be used during checkout by providing a valid gift card codes.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        privateMetadata: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MetadataItem))) },
        privateMetaField: { type: GraphQLString },
        privateMetaFields: { type: GraphQLString },
        metadata: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MetadataItem))) },
        metafield: { type: GraphQLString },
        metafields: { type: GraphQLString },
        displayCode: { type: GraphQLString },
        last4CodeChars: { type: GraphQLString },
        code: { type: GraphQLString },
        created: { type: GraphQLString },
        createdBy: { type: User },
        usedBy: { type: User },
        createdByEmail: { type: GraphQLString },
        usedByEmail: { type: GraphQLString },
        lastUsedOn: { type: GraphQLString },
        expiryDate: { type: GraphQLString },
        app: { type: App },
        product: { type: Product },
        events: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GiftCardEvent))) },
        tags: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GiftCardTag))) },
        boughtInChannel: { type: GraphQLString },
        isActive: { type: GraphQLNonNull(GraphQLBoolean) },
        initialBalance: { type: Money },
        currentBalance: { type: Money },
        user: { type: User },
        endDate: { type: GraphQLString },
        startDate: { type: GraphQLString }
    })
});