const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList
} = require("graphql");

// data types
const UiText = require("./UiText");
const UiNode = require("./UiNode");

module.exports = new GraphQLObjectType({
    name: "UiContainer_",
    description: "Container represents a HTML Form. The container can work with both HTTP Form and JSON requests",
    fields: () => ({
            action: { type: GraphQLNonNull(GraphQLString), description: "Action should be used as the form action URL `<form action=\"{{ .Action }}\" method=\"post\">`." },
            messages: { type: GraphQLList(UiText) },
            method: { type: GraphQLNonNull(GraphQLString), description: "Method is the form method (e.g. POST)" },
            nodes: { type: GraphQLNonNull(UiNode) },
            
    })
});