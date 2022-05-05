const {uuid} = require('uuidv4');
const pgKratosQueries = require('../../postgres/kratos-queries');
const recoveryFlowHandler = require('../../flows/recoveryFlowHandler');
const identityRecoveryAddressHandler = require('../../identities/identityRecoveryAddressHandler');
const identityRecoveryTokenHandler = require('../../identities/identityRecoveryTokenHandler');
const { NETWORK_ID } = require('../../libs/consts');

const getData = ({createRecoveryLinkInput}) => {
    return new Promise((resolve, reject) => {
        let expiresIn = createRecoveryLinkInput.expiresIn;
        let identityId = createRecoveryLinkInput.identityId;

        let expiresAt = new Date(expiresIn).toUTCString()

        if(expiresIn != null){
            let expireDate = new Date(expiresIn);
            if(Date.now() > expireDate.getTime()){
                return reject("Expires is in the past. Please specify a future date");
            }
        }

        let recoveryLink = `/recovery/${token}`;

        let now = new Date().toUTCString();
        let values = [
            uuid(),
            identityRecoveryAddressHandler.getVia(),
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
                    identityRecoveryTokenHandler.generateToken(),
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