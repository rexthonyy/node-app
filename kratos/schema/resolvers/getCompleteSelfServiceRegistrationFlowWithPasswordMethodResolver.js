const pgKratosQueries = require('../../postgres/kratos-queries');

const getData = ({flow, selfServiceRegistrationMethodsPasswordInput}) => {
    return new Promise((resolve, reject) => {
        resolve({
            identity: { 
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
            },
            session: {
                active: true,
                authenticatedAt: "2022-01-32",
                expiresAt: "2022-01-32",
                id: "202232",
                identity: { 
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
                },
                issuedAt: "202232",
            },
            sessionToken: "2022-01-3234242"
        });
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}