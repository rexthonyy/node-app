const pgKratosQueries = require('../../postgres/kratos-queries');

const getData = ({authorization, cookie}) => {
    return new Promise((resolve, reject) => {
        if(!(authorization || cookie)){
            return reject("Please provide an authorization token");
        }
        let token;
        if(cookie){
            token = cookie;
        }
        if(authorization){
            token = authorization;
        }

        pgKratosQueries.getSessionByToken([token], result => {
            if(result.err || result.res.length == 0){
                return reject("Invalid authorization token");
            }

            let session = result.res[0];

            let active = session.active;
            let authenticatedAt = session.authenticated_at;
            let expiresAt = session.expires_at;
            let id = session.id;
            let identity = session.identity_id;
            let issuedAt = session.issued_at;

            resolve({
                active,
                authenticatedAt,
                expiresAt,
                id,
                identity,
                issuedAt
            })
        });
        /*resolve({
            active: false,
            authenticatedAt: "2022-01",
            expiresAt: "2022-01",
            id: 1,
            identity: "32453",
            issuedAt: "2022-02"
        });*/
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}