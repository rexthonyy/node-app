const {
    checkAuthorization
} = require('./lib');
//.
const getGraphQLProductTypeById = require('./lib/getGraphQLProductTypeById');

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return reject(message);

        let id = args.id;
        try {
            return resolve(await getGraphQLProductTypeById(id));
        } catch (err) {
            reject(err);
        }
    });
}