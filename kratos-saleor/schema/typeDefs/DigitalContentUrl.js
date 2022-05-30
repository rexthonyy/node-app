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
const DigitalContent = require("./DigitalContent");

module.exports = new GraphQLObjectType({
    name: "DigitalContentUrl",
    description: "List of URLs for the digital variant.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        content: { type: GraphQLNonNull(DigitalContent) },
        created: { type: GraphQLNonNull(GraphQLString) },
        downloadNum: { type: GraphQLNonNull(GraphQLInt) },
        url: { type: GraphQLString },
        token: { type: GraphQLString }
    })
});