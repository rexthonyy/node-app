const jwt = require('jsonwebtoken');
const pgQueries = require('../postgres/kratos-queries');

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
    pgQueries.getSessionByToken([accessToken], result => {
        if (result.err || result.res.length == 0) return next();
        let session = result.res[0];
        if (!session.active) return next();
        req.kratosSession = session;
        next();
    });
}

module.exports = {
    isEmailValid,
    isAuthenticated
}