module.exports = async(parent, args, context) => {
    return new Promise((resolve, reject) => {
        // if (!context.user) return resolve(getGraphQLOutput("authorization-bearer", "Please enter a valid authorization header", "JWT_INVALID_TOKEN", null, null));
        // const authUser = context.user;

        console.log(context.file);
        console.log(context.user);
        resolve("1");
    });
}