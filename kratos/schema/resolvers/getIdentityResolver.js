const pgKratosQueries = require('../../postgres/kratos-queries');

const getData = ({id}) => {
    return new Promise((resolve, reject) => {
        resolve({
            id: id,
            recoveryAddresses: [
                {
                    id: id,
                    value: "/home",
                    via: "api"
                }
            ],
            schemaId: "schema123",
            schemaUrl: "/root",
            traits: "trait",
            verifiableAddresses: [
                {
                    id: id,
                    status: "active",
                    value: "/home",
                    verified: true,
                    verifiedAt: "2022",
                    via: "api"
                }
            ]
        });
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}