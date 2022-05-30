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
const AttributeValueTranslation = require("./AttributeValueTranslation");
const File = require("./File");

module.exports = new GraphQLObjectType({
    name: "AttributeValue",
    description: "Represents a value of an attribute.",

    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        slug: { type: GraphQLString },
        value: { type: GraphQLString },
        translation: { type: AttributeValueTranslation },
        inputType: { type: GraphQLString },
        reference: { type: GraphQLID },
        file: { type: File },
        richText: { type: GraphQLString },
        boolean: { type: GraphQLBoolean },
        date: { type: GraphQLString },
        dateTime: { type: GraphQLString }
    })
});