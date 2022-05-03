var Validator = require('jsonschema').Validator;
var v = new Validator();
const {uuid} = require('uuidv4');
const pgKratosQueries = require('../../postgres/kratos-queries');
const schemaHandler = require('../../identities/schemaHandler');
const getIdentityById = require('../resolverUtils/getIdentityById');

const getData = ({createIdentityInput}) => {
    return new Promise((resolve, reject) => {
        let schemaId = createIdentityInput.schemaId;
        let traits = JSON.parse(createIdentityInput.traits);

        let identitySchema = schemaHandler.getJSONSchemaById(schemaId);
        let errors = v.validate(traits,identitySchema).errors
        if(errors.length > 0){
            return reject(JSON.stringify(errors));
        }

        let now = new Date().toUTCString();
        let values = [
            uuid(),
            schemaId,
            JSON.stringify(traits),
            now,
            now,
            NETWORK_ID,
            "active",
            now
        ];
        pgKratosQueries.createIdentity(values, result => {
            if(result.err){
                console.error(result.err);
                return reject("Identity could not be created");
            }

            let identityId = result.res.id;

            getIdentityById(identityId, identity => {
                if(typeof identity == "string"){
                    return reject(identity);
                }

                resolve(identity);
            });
        });

        /*resolve({
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
        });*/
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}