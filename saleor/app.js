require("dotenv").config();
require('./postgres/initialize_dbs').init()
.then(() => {
  const express = require('express');
  const { ApolloServer } = require("apollo-server");
  const { graphqlHTTP } = require('express-graphql');
  //const schema = require('./schema/index');
  const schema = require('./schema.graphql');

  const app = express();
  
  app.use(express.static('public'));
  app.use(express.json());
  
  async function main() {
    const server = new ApolloServer({
      schema,
      uploads: false
    });
  
    const { url } = await server.listen({port: process.env.PORT1});
    console.log(`🚀 Server ready at ${url}`);


    app.use('/graphql', 
    graphqlHTTP({
        schema,
        graphiql: true,
    }));
    
    let port = process.env.PORT || 1000;
    var lesServer = app.listen(port, function() {
        console.log("Listening on port %s...", lesServer.address().port);
    });
  }

  main().catch(e => {
    console.error(e);
    process.exit(1);
  });

});