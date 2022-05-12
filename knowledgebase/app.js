require("dotenv").config();
require('./postgres/initialize_dbs').init()
.then(() => {
  const pg = require("pg");
  const cors = require("cors");
  const express = require('express');
  const { stitchSchemas } = require('@graphql-tools/stitch');
  const { ApolloServer } = require("apollo-server");
  const { makeSchemaAndPlugin } = require("postgraphile-apollo-server");
  const { graphqlHTTP } = require('express-graphql');
  const { graphqlUploadExpress } = require('graphql-upload');
  const schema1 = require('./schema/index');

  const S3 = require('aws-sdk/clients/s3');
  const AWS = require('aws-sdk');
  const wasabiEndpoint = new AWS.Endpoint('s3.eu-west-1.wasabisys.com');

  const accessKeyId = process.env.WASABI_ACCESS_KEY_ID;
  const secretAccessKey = process.env.WASABI_SECRET_ACCESS_KEY;

  const s3 = new S3({
    endpoint: wasabiEndpoint,
    region: 'us-east-2',
    accessKeyId,
    secretAccessKey
  });

  
  s3.putObject({
    Body: 'Hello World',
    Bucket: "friendlygig",
    Key: 'hello.txt'
  }, (err, data) => {
    if (err) {
      console.log("upload unsuccessful");
       return console.log(err);
    }
    console.log("upload successful");
    console.log(data);
  });

  const app = express();

  app.use(cors());

  const pgPool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
  });
  
  app.use(express.static('public'));
  app.use(express.json());

  async function main() {
    const { schema, plugin } = await makeSchemaAndPlugin(
      pgPool,
      'public', // PostgreSQL schema to use
      {
        
      }
    );

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
    //   plugins: [plugin],
    //   uploads: false
    // });
    const server = new ApolloServer({
      schema: schema1,
      plugins: [plugin],
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