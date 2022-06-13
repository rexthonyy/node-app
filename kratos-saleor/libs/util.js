const jwt = require('jsonwebtoken');
const pgKratosQueries = require('../postgres/kratos-queries');

function isEmailValid(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

function isAuthenticated(req, res, next) {
    const accessToken = req.cookies[process.env.COOKIE_ID];
    if (accessToken == undefined) return next();
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) return next();
        let user_id = payload.sub;
        pgKratosQueries.getUserById([user_id], result => {
            if (result.err) return next();
            req.session.isAuthenticated = true;
            next();
        });
    });
}

function getRandom(min, max) {
    return myMap(Math.random(), 0, 1, min, max);
}

function myMap(val, minF, maxF, minT, maxT) {
    return minT + (((val - minF) / (maxF - minF)) * (maxT - minT));
}

module.exports = {
    isEmailValid,
    isAuthenticated,
    getRandom
}