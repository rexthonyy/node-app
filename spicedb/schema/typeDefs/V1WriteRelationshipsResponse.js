const {
    GraphQLObjectType
} = require("graphql");

const V1ZedToken = require("./V1ZedToken");

module.exports = new GraphQLObjectType({
    name: "V1WriteRelationshipsResponse_",
    fields: () => ({
        writtenAt: { type: V1ZedToken, description: "ZedToken is used to provide causality metadata between Write and Check requests.\n\nSee the authzed.api.v1.Consistency message for more information." }
    })
});