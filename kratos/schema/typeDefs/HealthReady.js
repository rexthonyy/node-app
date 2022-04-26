const {
    GraphQLObjectType,
    GraphQLString
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "HealthReady_",
    fields: () => ({
            status: { type: GraphQLString, description: "Always \"ok\"." }
    })
});