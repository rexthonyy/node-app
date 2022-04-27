const pgKratosQueries = require('../../postgres/kratos-queries');

const getData = ({flow, selfServiceRegistrationMethodsPasswordInput}) => {
    return new Promise((resolve, reject) => {
        resolve({
            flow: {
                active: "true",
                expiresAt: "202232",
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
            },
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
            }
        });
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}