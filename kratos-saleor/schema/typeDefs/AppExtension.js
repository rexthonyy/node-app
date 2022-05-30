const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLID
} = require("graphql");


// data types
const Permissions = require("./Permissions");
const App = require("./App");

module.exports = new GraphQLObjectType({
    name: "AppExtension",
    description: "Represents app data.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        permissions: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(Permissions))) },
        label: { type: GraphQLString },
        url: { type: GraphQLString },
        mount: { type: GraphQLString},
        target: { type: GraphQLString },
        app: { type: GraphQLNonNull(App) },
        accessToken: { type: GraphQLString }
    })
});