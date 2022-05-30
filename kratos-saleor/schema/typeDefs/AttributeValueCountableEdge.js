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
const AttributeValue = require("./AttributeValue");

module.exports = new GraphQLObjectType({
    name: "AttributeValueCountableEdge",
    fields: () => ({
        node: { type: GraphQLNonNull(AttributeValue) },
        cursor: { type: GraphQLString }
    })
});