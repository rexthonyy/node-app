require("dotenv").config();
require('./postgres/initialize_dbs').init()
.then(async () => {
  const express = require('express');
  const { stitchSchemas } = require('@graphql-tools/stitch');
  const { ApolloServer } = require("apollo-server");
  const { graphqlHTTP } = require('express-graphql');
  const { createGraphQLSchema } = require("openapi-to-graphql");
  const { graphqlUploadExpress } = require('graphql-upload');
  // const oas = require("./openapi.json");
  // const { schema } = await createGraphQLSchema([oas]);
  const schema1 = require('./schema/index');

  const app = express();
  
  app.use(express.static('public'));
  app.use(express.json());
  
  async function main() {

    // const server = new ApolloServer({
    //   schema: stitchSchemas({
    //   subschemas: [
    //     {
    //       schema: schema
    //     },
    //     {
    //       schema: schema1
    //     }
    //   ]
    //   }),
    //   uploads: false
    // });
  
    const server = new ApolloServer({
      schema: schema1,
      uploads: false
    });
  
    const { url } = await server.listen({port: process.env.PORT1});
    console.log(`🚀 Server ready at ${url}`);


    app.use('/graphql', 
    graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
    graphqlHTTP({
        schema: schema1,
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