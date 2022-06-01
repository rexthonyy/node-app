module.exports = async(parent, args, context) => {
    return new Promise((resolve) => {
        resolve(context.user);
    });
}