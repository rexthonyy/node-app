const { typeDefs } = require('./typeDefs');
const resolvers = require("./resolvers");

module.exports = {
    typeDefs,
    resolvers,
    playground: {
        settings: {
            'editor-theme': 'light'
        },
        tabs: [{
            endpoint,
            query,
            defaultQuery
        }]
    }
};