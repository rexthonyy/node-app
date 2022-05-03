const {uuid} = require('uuidv4');
const pgKratosQueries = require('../../postgres/kratos-queries');
const recoveryFlowHandler = require('../../flows/recoveryFlowHandler');
const {getSessionExpirationTime, generateToken} = require('../../libs/util');
const { NETWORK_ID } = require('../../libs/consts');

const getData = ({createRecoveryLinkInput}) => {
    return new Promise((resolve, reject) => {
        let expiresIn = createRecoveryLinkInput.expiresIn;
        let identityId = createRecoveryLinkInput.identityId;

        let token = generateToken(32);
        let recoveryLink = `/recovery/${token}`;
        let expiresAt = new Date(expiresIn).toUTCString()
        let now = new Date().toUTCString();
        let values = [
            uuid(),
            "api",
            recoveryLink,
            identityId,
            now,
            now,
            NETWORK_ID
        ];
        pgKratosQueries.createIdentityRecoveryAddress(values, result => {
            if(result.err){
                console.log(result.err);
                return reject("Could not create identity recovery address");
            }

            let identityRecoveryAddressId = result.res.id;

            values = [
                uuid(),
                recoveryFlowHandler.getRequestUrl(),
                now,
                recoveryFlowHandler.getExpiresAt().toUTCString(),
                recoveryFlowHandler.getActiveMethod(),
                uuid(),
                recoveryFlowHandler.getState(),
                recoveryFlowHandler.getRecoveredIdentityId(),
                now,
                now,
                recoveryFlowHandler.getType(),
                recoveryFlowHandler.getUI(),
                NETWORK_ID
            ];

            pgKratosQueries.createRecoveryFlow(values, result => {
                if(result.err){
                    return reject("Failed to create recovery flow");
                }
    
                let selfServiceRecoveryFlowId = result.res.id;

                values = [
                    uuid(),
                    token,
                    false,
                    null,
                    identityRecoveryAddressId,
                    selfServiceRecoveryFlowId,
                    now,
                    now,
                    expiresAt,
                    now,
                    NETWORK_ID
                ];

                pgKratosQueries.createIdentityRecoveryToken(values, result => {
                    if(result.err){
                        return reject("Failed to create identity recovery token");
                    }

                    resolve({
                        expiresAt,
                        recoveryLink
                    });
                });
            });
        });
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}