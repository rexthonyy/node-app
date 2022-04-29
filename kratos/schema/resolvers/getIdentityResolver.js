const pgKratosQueries = require('../../postgres/kratos-queries');

const getData = ({id}) => {
    return new Promise((resolve, reject) => {
        pgKratosQueries.getIdentityById([id], result => {
            if(result.err || result.res.length == 0){
                return reject("Identity not found");
            }

            let identity = result.res[0];

            let identityType = {
                id: identity.id,
                schemaId: identity.schema_id,
                schemaUrl: "",
                traits: JSON.stringify(identity.traits),
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

                    resolve(identityType);
                });
            });
        });
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}