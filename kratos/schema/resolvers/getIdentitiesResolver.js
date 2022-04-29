const pgKratosQueries = require('../../postgres/kratos-queries');

const getData = ({page, perPage}) => {
    //if(page == null || page == 0) page = null;
    //if(perPage == null) perPage = 0;

    return new Promise((resolve, reject) => {
        pgKratosQueries.getIdentities([page, perPage], result => {
            if(result.err){
                return resolve([]);
            }

            let identitiesType = [];
            let identities = result.res;
            console.log(identities);
            let num_identities = identities.length;
            let count = -1;

            identities.forEach(identity => {
                let identityType = {
                    id: identity.id,
                    schemaId: identity.schema_id,
                    schemaUrl: "",
                    traits: identity.traits,
                    recoveryAddresses: [],
                    verifiableAddresses: []
                };

                pgKratosQueries.getRecoveryAddressesByIdentityId([identity.id], result => {
                    if(result.err){
                        result.res = [];
                    }
                    let recoveryAddresses = result.res;
                    recoveryAddresses.forEach(recoveryAddress => {
                        identityType.recoveryAddresses.push({
                            id: recoveryAddress.id,
                            value: recoveryAddress.value,
                            via: recoveryAddress.via
                        });
                    });

                    pgKratosQueries.getVerifiableAddressesByIdentityId([identity.id], result => {
                        if(result.err){
                            result.res = [];
                        }
                        let verifiableAddresses = result.res;
                        verifiableAddresses.forEach(verifiableAddress => {
                            identityType.verifiableAddresses.push({
                                id: verifiableAddress.id,
                                status: verifiableAddress.status,
                                value: verifiableAddress.value,
                                verified: verifiableAddress.verified,
                                verifiedAt: verifiableAddress.verified_at,
                                via: verifiableAddress.via
                            });
                        });

                        identitiesType.push(identityType);

                        checkComplete();
                    });
                });
            });

            checkComplete();

            function checkComplete(){
                count++;
                if(count == num_identities){
                    resolve(identitiesType);
                }
            }
        });
        /*
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
        */
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}