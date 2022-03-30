require("dotenv").config();
const express = require('express');
const { postgraphile } = require("postgraphile");
const knowledgeBaseRouter = require('./api/apiKnowledgeBase');

const app = express();

console.log(process.env.DATABASE_URL);

app.use(
    postgraphile(process.env.DATABASE_URL, {
        watchPg: true,
        graphiql: true,
        enhanceGraphiql: true
    })
);

app.use(express.json());
    
app.use('/knowledgebase', knowledgeBaseRouter);

let port = process.env.PORT || 1000;
var server = app.listen(port, function() {
    console.log("Listening on port %s...", server.address().port);
});

app.get("/", (req, res) => {
    res.json({ 
        status: "success", 
        message: "Welcome to the Knowledgebase app"
    });
});