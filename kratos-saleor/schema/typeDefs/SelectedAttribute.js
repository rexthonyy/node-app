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
const Attribute = require("./Attribute");
const AttributeValue = require("./AttributeValue");

module.exports = new GraphQLObjectType({
    name: "SelectedAttribute",
    description: "Represents a custom attribute.",
    args: {
        variantSelection: { type: GraphQLString }
    },
    fields: () => ({
        attribute: { type: GraphQLNonNull(Attribute) },
        values: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(AttributeValue))) }
    })
});