require("dotenv").config();
const express = require('express');
const expressGraphQL = require("express-graphql");
const app = express();

app.use("/graphql", expressGraphQL({
    graphiql: true
}));

let port = process.env.PORT || 1000;
var server = app.listen(port, function() {
    console.log("Listening on port %s...", server.address().port);
});










//const express = require('express');
// const { postgraphile } = require("postgraphile");
// const knowledgeBaseRouter = require('./api/apiKnowledgeBase');

// const app = express();

// app.use(
//     postgraphile(process.env.DATABASE_URL, {
//         watchPg: true,
//         graphiql: true,
//         enhanceGraphiql: true
//     })
// );

// app.use(express.json());
    
// app.use('/knowledgebase', knowledgeBaseRouter);

// let port = process.env.PORT || 1000;
// var server = app.listen(port, function() {
//     console.log("Listening on port %s...", server.address().port);
// });

// app.get("/", (req, res) => {
//     res.json({ 
//         status: "success", 
//         message: "Welcome to the Knowledgebase app"
//     });
// });



const pg = require("pg");
const { ApolloServer } = require("apollo-server");
const { makeSchemaAndPlugin } = require("postgraphile-apollo-server");
 
const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});
 
async function main() {
  const { schema, plugin } = await makeSchemaAndPlugin(
    pgPool,
    'public', // PostgreSQL schema to use
    {
      // PostGraphile options, see:
      // https://www.graphile.org/postgraphile/usage-library/
    }
  );
 
  const server = new ApolloServer({
    schema,
    plugins: [plugin]
  });
 
  const { url } = await server.listen();
  console.log(`🚀 Server ready at ${url}`);
}
 
main().catch(e => {
  console.error(e);
  process.exit(1);
});