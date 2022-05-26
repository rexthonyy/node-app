require("dotenv").config();
require('./postgres/initialize_dbs').init()
.then(async () => {
  const Sentry = require("@sentry/node");
  Sentry.init({ dsn: "http://d78601a2198e422d8855c8be53f57061@88.208.212.249:8000/2" });
  const express = require('express');
  const session = require('express-session');
  const cookieParser = require('cookie-parser');
  const { graphqlHTTP } = require('express-graphql');
  const schema = require('./schema/index');
  const oauthRouter = require('./auth');

  const app = express();
  app.set('view engine', 'ejs');
  app.use(express.static('public'));
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }));
  app.use(express.json());
  app.use(Sentry.Handlers.requestHandler());
  app.use(cookieParser());
  app.use("/oauth2", oauthRouter);

  app.use('/graphql', 
  graphqlHTTP({
      schema,
      graphiql: true,
  }));
  
  let port = process.env.PORT || 1000;
  var lesServer = app.listen(port, function() {
      console.log("Listening on port %s...", lesServer.address().port);
  });

  app.use(Sentry.Handlers.errorHandler());
});