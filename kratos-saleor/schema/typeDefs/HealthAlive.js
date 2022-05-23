const {
    GraphQLObjectType,
    GraphQLString
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "HealthAlive_",
    fields: () => ({
            status: { type: GraphQLString, description: "Always \"ok\"." }
    })
});