const pgKratosQueries = require('../../postgres/kratos-queries');

const getData = ({id}) => {
    return new Promise((resolve, reject) => {
        resolve({
            active: "active",
            expiresAt: "2022-01",
            forced: true,
            id: id,
            issuedAt: "2022-02",
            requestUrl: "/root",
            type: "browser",
            ui: {
                action: "active",
                message: [{
                    context: null,
                    id: id,
                    text: "update",
                    type: "container"
                }],
                method: "post",
                nodes: {
                    attributes: {
                        type: "attr"
                    },
                    group: "one",
                    messages: [{
                        context: null,
                        id: id,
                        text: "update",
                        type: "container"
                    }]
                }
            }
        });
    });
}

module.exports = async (parent, args) => {
    return await getData(args);
}