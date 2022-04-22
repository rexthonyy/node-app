"use strict";

require("dotenv").config();

require('./postgres/initialize_dbs').init().then(function _callee() {
  var express, _require, stitchSchemas, _require2, ApolloServer, _require3, graphqlHTTP, _require4, createGraphQLSchema, oas, _ref, schema, report1, schema1, app, main;

  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          main = function _ref3() {
            var server, apolloPort, _ref2, url, port, lesServer;

            return regeneratorRuntime.async(function main$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    server = new ApolloServer({
                      schema: stitchSchemas({
                        subschemas: [{
                          schema: schema
                        }, {
                          schema: schema1
                        }]
                      }),
                      uploads: false
                    });
                    apolloPort = process.env.PORT1 || 1100;
                    _context.next = 4;
                    return regeneratorRuntime.awrap(server.listen({
                      port: apolloPort
                    }));

                  case 4:
                    _ref2 = _context.sent;
                    url = _ref2.url;
                    console.log("\uD83D\uDE80 Server ready at ".concat(url));
                    app.use('/graphql', graphqlHTTP({
                      schema: stitchSchemas({
                        subschemas: [{
                          schema: schema
                        }, {
                          schema: schema1
                        }]
                      }),
                      graphiql: true
                    }));
                    port = process.env.PORT || 1000;
                    lesServer = app.listen(port, function () {
                      console.log("Listening on port %s...", lesServer.address().port);
                    });

                  case 10:
                  case "end":
                    return _context.stop();
                }
              }
            });
          };

          express = require('express');
          _require = require('@graphql-tools/stitch'), stitchSchemas = _require.stitchSchemas;
          _require2 = require("apollo-server"), ApolloServer = _require2.ApolloServer;
          _require3 = require('express-graphql'), graphqlHTTP = _require3.graphqlHTTP;
          _require4 = require("openapi-to-graphql"), createGraphQLSchema = _require4.createGraphQLSchema; //const oas1 = require("./api.openapi.json");
          //const oas2 = require("./openapi.json");

          oas = require("./openapi1.json");
          _context2.next = 9;
          return regeneratorRuntime.awrap(createGraphQLSchema([oas]));

        case 9:
          _ref = _context2.sent;
          schema = _ref.schema;
          report1 = _ref.report1;
          schema1 = require('./schema/index');
          app = express();
          app.use(express["static"]('public'));
          app.use(express.json());
          main()["catch"](function (e) {
            console.error(e);
            process.exit(1);
          });

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  });
});