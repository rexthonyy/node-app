require("dotenv").config();
require('./postgres/initialize_dbs').init()
.then(async () => {
  const express = require('express');
  const { graphqlHTTP } = require('express-graphql');
  const schema = require('./schema/index');

  const app = express();
  
  app.use(express.json());
  
  async function main() {
    app.use('/graphql', 
    graphqlHTTP({
        schema: schema,
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