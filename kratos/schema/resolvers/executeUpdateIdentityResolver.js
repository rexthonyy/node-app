var Validator = require('jsonschema').Validator;
var v = new Validator();
const schemaHandler = require('../../identities/schemaHandler');
const pgKratosQueries = require('../../postgres/kratos-queries');
const getIdentityById = require('../resolverUtils/getIdentityById');

const getData = ({id, updateIdentityInput}) => {
    return new Promise((resolve, reject) => {
        let identityId = id;
        let schemaId = updateIdentityInput.schemaId;
        let traits = JSON.parse(updateIdentityInput.traits);

        let identitySchema = JSON.parse(schemaHandler.getJSONSchemaById(schemaId));
        let errors = v.validate(traits,identitySchema).errors
        if(errors.length > 0){
            return reject(JSON.stringify(errors));
        }

        let now = new Date().toUTCString();

        let values = [
            identityId,
            schemaId,
            traits,
            now
        ];

        pgKratosQueries.updateIdentity(values, result => {
            if(result.err){
                console.error(result.err);
                return reject("Could not update identity");
            }

            getIdentityById(identityId, identity => {
                if(typeof identity == "string"){
                    return reject(identity);
                }

                resolve(identity);
            });
        });
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}