module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        if (!context.user) return resolve(getGraphQLOutput("failed", "Please enter a valid authorization header", null));
        const authUser = context.user;

        resolve({
            status: "success",
            message: "Fetch successful!",
            result: [{
                channelId: 1,
                shiftGroupId: 2,
                name: "abcd"
            }]
        });
    });
}


function getGraphQLOutput(status, message, result) {
    return {
        status,
        message,
        result
    };
}