const pgKratosQueries = require('../../postgres/kratos-queries');

const getData = ({refresh}) => {
    return new Promise((resolve, reject) => {
        resolve({
            active: "active",
            expiresAt: "2022-01",
            forced: true,
            id: 1,
            issuedAt: "2022-02",
            requestUrl: "/root",
            type: "browser",
            ui: {
                action: "active",
                messages: [{
                    context: "api",
                    id: 1,
                    text: "update",
                    type: "container"
                }],
                method: "post",
                nodes: {
                    attributes: {
                        type: "attr"
                    },
                    group: "one",
                    messages: {
                        context: "api",
                        id: 2,
                        text: "update",
                        type: "container"
                    },
                    type: "api"
                }
            }
        });
    });
}

module.exports = async (parent, args) => {
    return await getData(args);
}