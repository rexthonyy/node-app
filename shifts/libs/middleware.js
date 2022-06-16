module.exports = async(resolve, root, args, context, info) => {
    context.user = await getAuthenticatedUser(context);
    return resolve(root, args, context, info);
};

let getAuthenticatedUser = (context) => {
    return new Promise((resolve) => {
        resolve(null);
    });
}