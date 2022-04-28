require("dotenv").config();
require('./postgres/initialize_dbs').init()
.then(() => {
  const pg = require("pg");
  const express = require('express');
  const { stitchSchemas } = require('@graphql-tools/stitch');
  const { ApolloServer } = require("apollo-server");
  const { makeSchemaAndPlugin } = require("postgraphile-apollo-server");
  const { graphqlHTTP } = require('express-graphql');
  const { graphqlUploadExpress } = require('graphql-upload');
  const schema1 = require('./schema/index');

  const app = express();

  const pgPool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
  });
  
  app.use(express.static('public'));
  app.use(express.json());
  
  async function main() {
    const { schema, plugin } = await makeSchemaAndPlugin(
      pgPool,
      'public', // PostgreSQL schema to use.
      {
        // PostGraphile options, see:
        // https://www.graphile.org/postgraphile/usage-library/
      }
    );

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
      plugins: [plugin],
      uploads: false
    });
  
    const { url } = await server.listen();
    console.log(`🚀 Server ready at ${url}`);


    app.use('/graphql', 
    graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
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