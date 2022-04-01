const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString
} = require("graphql");

const schema1 = new GraphQLSchema({
    query: new GraphQLObjectType({
		name: "helloworld",
		fields: () => ({
			message: {
				type: GraphQLString,
				resolve: () => "hello world"
			}
		})
    })
});


module.exports = schema1;