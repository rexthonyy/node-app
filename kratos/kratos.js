require("dotenv").config();
require('./postgres/initialize_dbs').init()
.then(async () => {
  const Sentry = require("@sentry/node");
  Sentry.init({ dsn: "http://d78601a2198e422d8855c8be53f57061@88.208.212.249:8000/2" });
  const express = require('express');
  const { stitchSchemas } = require('@graphql-tools/stitch');
  const { ApolloServer } = require("apollo-server");
  const { graphqlHTTP } = require('express-graphql');
  const { createGraphQLSchema } = require("openapi-to-graphql");
  const oas1 = require("./api.openapi.json");
  const oas2 = require("./openapi.json");
  const { schema } = await createGraphQLSchema([oas1, oas2]);
  const schema1 = require('./schema/index');

  const app = express();

  app.use(express.static('public'));
  app.use(express.json());
  app.use(Sentry.Handlers.requestHandler());

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

  app.use(Sentry.Handlers.errorHandler());
});