const { getAuthenticatedUser } = require('./lib');

module.exports = async(parent, args, context) => {
    return new Promise((resolve, reject) => {
        getAuthenticatedUser(context, authUser => {
            if (authUser == null) return "user not found";
            resolve(authUser);
        });
    });
}