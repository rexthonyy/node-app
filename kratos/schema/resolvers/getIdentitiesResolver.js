const pgKratosQueries = require('../../postgres/kratos-queries');
const getIdentityById = require('../resolverUtils/getIdentityById');

const getData = ({page, perPage}) => {
    if(page == null || page == 0) page = null;
    if(perPage == null) perPage = 0;

    return new Promise((resolve, reject) => {
        pgKratosQueries.getIdentities([perPage, page], result => {
            if(result.err){
                return resolve([]);
            }

            let identitiesType = [];
            let identities = result.res;
            let num_identities = identities.length;
            let count = -1;

            identities.forEach(identity => {
                getIdentityById(identity.id, identityType => {
                    if(typeof identity != "string"){
                        identitiesType.push(identityType);
                    }
                    checkComplete();
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
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}