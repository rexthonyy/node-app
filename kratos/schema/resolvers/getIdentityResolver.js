const getIdentityById = require('../resolverUtils/getIdentityById');

const getData = ({id}) => {
    return new Promise((resolve, reject) => {
        getIdentityById(id, identity => {
            if(typeof identity == "string"){
                return reject(identity);
            }
            resolve(identity);
        });
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}