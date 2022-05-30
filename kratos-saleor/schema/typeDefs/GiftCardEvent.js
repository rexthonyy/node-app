const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLID
} = require("graphql");


// data types
const GiftCardEventBalance = require("./GiftCardEventBalance");
const User = require("./User");
const App = require("./App");
const GiftCardEventFilterInput = require("./GiftCardEventFilterInput");

module.exports = new GraphQLObjectType({
    name: "GiftCardEvent",
    args: {
        filter: { type: GiftCardEventFilterInput }
    },
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        date: { type: GraphQLString },
        type: { type: GraphQLString },
        user: { type: User },
        app: { type: App },
        message: { type: GraphQLString },
        email: { type: GraphQLString },
        orderId: { type: GraphQLID },
        orderNumber: { type: GraphQLString },
        tags: { type: GraphQLList(GraphQLNonNull(GraphQLString)) },
        oldTags: { type: GraphQLList(GraphQLNonNull(GraphQLString)) },
        balance: { type: GiftCardEventBalance },
        expiryDate: { type: GraphQLString },
        oldExpiryDate: { type: GraphQLString }
    })
});