const {
    GraphQLObjectType,
    GraphQLString
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "SearchTagType",
    description: "An object that is used to return the result of searching a tag",
    fields: () => ({
            item: { type: GraphQLString },
            object: { type: GraphQLString }
    })
});