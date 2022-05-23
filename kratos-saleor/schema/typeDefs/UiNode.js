const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLInt
} = require("graphql");

// data types
const UiText = require("./UiText");
const UiNodeAttributes = require("./UiNodeAttributes");

module.exports = new GraphQLObjectType({
    name: "UiNode_",
    description: "Nodes are represented as HTML elements or their native UI equivalents. For example, a node can be an `<img>` tag, or an `<input element>` but also `some plain text`.",
    fields: () => ({
            attributes: { type: UiNodeAttributes },
            group: { type: GraphQLNonNull(GraphQLString) },
            messages: { type: GraphQLNonNull(UiText) },
            type: { type: GraphQLNonNull(GraphQLString) }
            
    })
});