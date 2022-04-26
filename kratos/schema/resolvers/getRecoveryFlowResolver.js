const pgKratosQueries = require('../../postgres/kratos-queries');

const getData = () => {
    return new Promise((resolve, reject) => {
        resolve({
            active: "active",
            expiresAt: "2022-01",
            id: "id1",
            issuedAt: "2022-02",
            messages: [{
                context: "api",
                id: 1,
                text: "update",
                type: "container"
            }],
            methods: "post",
            requestUrl: "/root",
            state: "active",
            type: "browser"
        });
    });
}

module.exports = async () => {
    return getData();
}