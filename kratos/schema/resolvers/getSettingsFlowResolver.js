let {uuid} = require("uuidv4");
const pgKratosQueries = require('../../postgres/kratos-queries');
const settingsFlowHandler = require('../../flows/settingsFlowHandler');
const getIdentityById = require('../resolverUtils/getIdentityById');
const consts = require('../../libs/consts');
const getData = ({sessionToken}) => {
    return new Promise((resolve, reject) => {
        pgKratosQueries.getSessionByToken([sessionToken], result => {
            if(result.err || result.res.length == 0){
                return reject("Session token not found");
            }

            let session = result.res[0];
            let expiresAt = session.expires_at;

            if(expiresAt != null){
                let expireDate = new Date(expiresAt);
                if(Date.now() > expireDate.getTime()){
                    return reject("Session expired");
                }else{
                    console.log(Date.now() - expireDate.getTime());
                }
            }

            let identityId = session.identity_id;


            let now = new Date().toUTCString();
            const values = [
                uuid(),
                settingsFlowHandler.getRequestUrl(),
                now,
                settingsFlowHandler.getExpiresAt().toUTCString(),
                identityId,
                now,
                now,
                settingsFlowHandler.getActiveMethod(),
                settingsFlowHandler.getState(),
                settingsFlowHandler.getType(),
                settingsFlowHandler.getUI(),
                consts.NETWORK_ID,
                settingsFlowHandler.getInternalContext()
            ];
            pgKratosQueries.createSettingsFlow(values, result => {
                if(result.err || result.res.length == 0){
                    return reject("Failed to create settings flow");
                }
                
                let selfServiceSettingsFlow = result.res;
    
                getIdentityById(selfServiceSettingsFlow.identity_id, identity => {
                    if(typeof identity == "string"){
                        return reject(identity);
                    }
                    let id = selfServiceSettingsFlow.id;
                    let active = selfServiceSettingsFlow.active_method;
                    let expiresAt = selfServiceSettingsFlow.expires_at;
                    let issuedAt = selfServiceSettingsFlow.issued_at;
                    let requestUrl = selfServiceSettingsFlow.request_url;
                    let messages = selfServiceSettingsFlow.ui.messages;
                    let methods = selfServiceSettingsFlow.ui.method;
                    let state = selfServiceSettingsFlow.state;
                    let type = selfServiceSettingsFlow.type;
        
                    resolve({
                        active,
                        expiresAt,
                        id,
                        identity,
                        issuedAt,
                        messages,
                        methods,
                        requestUrl,
                        state,
                        type
                    });
                });
            });
            /*resolve({
                active: "active",
                expiresAt: "2022-01",
                id: "id-1",
                identity: "identity",
                issuedAt: "2022-02",
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
            });*/
        });
    });
}

module.exports = async (parents, args) => {
    return getData(args);
}