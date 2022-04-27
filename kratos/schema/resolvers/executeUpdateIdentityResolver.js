const pgKratosQueries = require('../../postgres/kratos-queries');

const getData = ({id, updateIdentityInput}) => {
    return new Promise((resolve, reject) => {
        resolve({
            id: "202232",
            recoveryAddresses: [{ 
                id: "202232",
                value: "202232",
                via: "api"
                }],
            schemaId: "202232",
            schemaUrl: "/root",
            traits: "202232",
            verifiableAddresses: [{  
                id: "202232",
                status: "pending",
                value: "202232",
                verified: true,
                verifiedAt: "202232",
                via: "api",
            }]
        });
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}