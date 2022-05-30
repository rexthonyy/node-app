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
const AppToken = require("./AppToken");
const Webhook = require("./Webhook");
const AppExtension = require("./AppExtension");

module.exports = new GraphQLObjectType({
    name: "App",
    description: "Represents app data.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        privateMetadata: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MetadataItem))) },
        privateMetaField: { type: GraphQLString },
        privateMetaFields: { type: GraphQLString },
        metadata: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MetadataItem))) },
        metafield: { type: GraphQLString },
        metafields: { type: GraphQLString },
        permissions: { type: GraphQLList(Permissions) },
        created: { type: GraphQLString },
        isActive: { type: GraphQLNonNull(GraphQLBoolean) },
        name: { type: GraphQLString },
        type: { type: GraphQLString },
        tokens: { type: AppToken },
        webhooks: { type: GraphQLNonNull(Webhook) },
        aboutApp: { type: GraphQLString },
        dataPrivacy: { type: GraphQLString },
        dataPrivacyUrl: { type: GraphQLString },
        homepageUrl: { type: GraphQLString },
        supportUrl: { type: GraphQLString },
        configurationUrl: { type: GraphQLString },
        appUrl: { type: GraphQLString },
        version: { type: GraphQLString },
        accessToken: { type: GraphQLString },
        extensions: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(AppExtension))) }
    })
});