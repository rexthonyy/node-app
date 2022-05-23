const pgKratosQueries = require('../../postgres/kratos-queries');
const schemaHandler = require('../../identities/schemaHandler');

let getIdentityById = (identityId, cb) => {
    pgKratosQueries.getIdentityById([identityId], result => {
        if(result.err || result.res.length == 0){
            return cb("Identity not found");
        }

        let identity = result.res[0];

        let identityType = {
            id: identity.id,
            schemaId: identity.schema_id,
            schemaUrl: schemaHandler.getJSONSchemaUrlById(identity.schema_id),
            traits: JSON.stringify(identity.traits),
            recoveryAddresses: [],
            verifiableAddresses: []
        };

        pgKratosQueries.getRecoveryAddressesByIdentityId([identity.id], result2 => {
            if(result2.err){
                result2.res = [];
            }
            let recoveryAddresses = result2.res;
            recoveryAddresses.forEach(recoveryAddress => {
                identityType.recoveryAddresses.push({
                    id: recoveryAddress.id,
                    value: recoveryAddress.value,
                    via: recoveryAddress.via
                });
            });

            pgKratosQueries.getVerifiableAddressesByIdentityId([identity.id], result1 => {
                if(result1.err){
                    result1.res = [];
                }
                let verifiableAddresses = result1.res;
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

                cb(identityType);
            });
        });
    });
};

module.exports = getIdentityById;