const {
    GraphQLString,
    GraphQLInputObjectType,
} = require("graphql");

module.exports = new GraphQLInputObjectType({
    name: "SubjectFilterRelationFilterInput_",
    fields: () => ({
        relation: { type: GraphQLString }
    })
});