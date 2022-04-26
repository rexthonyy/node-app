const pgKratosQueries = require('../../postgres/kratos-queries');

const getData = ({page, perPage}) => {
    return new Promise((resolve, reject) => {
        resolve([
            {
                id: "id-1",
                recoveryAddresses: [
                    {
                        id: "id-1",
                        value: "/home",
                        via: "api"
                    }
                ],
                schemaId: "schema123",
                schemaUrl: "/root",
                traits: "trait",
                verifiableAddresses: [
                    {
                        id: "id-1",
                        status: "active",
                        value: "/home",
                        verified: true,
                        verifiedAt: "2022",
                        via: "api"
                    }
                ]
            }    
        ]);
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}