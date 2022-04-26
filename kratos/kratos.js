require("dotenv").config();
require('./postgres/initialize_dbs').init()
.then(async () => {
  const express = require('express');
  const { stitchSchemas } = require('@graphql-tools/stitch');
  const { ApolloServer } = require("apollo-server");
  const { graphqlHTTP } = require('express-graphql');
  const { createGraphQLSchema } = require("openapi-to-graphql");
  const oas1 = require("./api.openapi.json");
  const oas2 = require("./openapi.json");
  const { schema, report1 } = await createGraphQLSchema([oas1, oas2]);
  // const oas1 = require("./openapi1.json");
  // const { schema, report1 } = await createGraphQLSchema([oas1]);
  const schema1 = require('./schema/index');
  console.log(schema);

  const app = express();

  app.use(express.static('public'));
  app.use(express.json());
  
  async function main() {

    const server = new ApolloServer({
      schema: stitchSchemas({
      subschemas: [
        {
          schema: schema
        },
        {
          schema: schema1
        }
      ]
      }),
      uploads: false
    });
  
    let apolloPort = process.env.PORT1 || 1100;
    const { url } = await server.listen({port: apolloPort});
    console.log(`🚀 Server ready at ${url}`);


    app.use('/graphql', 
    graphqlHTTP({
        schema: stitchSchemas({
      subschemas: [
        {
          schema: schema
        },
        {
          schema: schema1
        }
      ]
      }),
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