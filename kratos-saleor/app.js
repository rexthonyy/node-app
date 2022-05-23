require("dotenv").config();
require('./postgres/initialize_dbs').init()
.then(async () => {
  const Sentry = require("@sentry/node");
  Sentry.init({ dsn: "http://d78601a2198e422d8855c8be53f57061@88.208.212.249:8000/2" });
  const express = require('express');
  const { graphqlHTTP } = require('express-graphql');
  const schema = require('./schema/index');

  const app = express();

  app.use(express.json());
  app.use(Sentry.Handlers.requestHandler());

  async function main() {

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

  app.use(Sentry.Handlers.errorHandler());
});