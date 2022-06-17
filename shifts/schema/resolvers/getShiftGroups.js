module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        if (!context.user) context.user = null;
        const authUser = context.user;
        console.log(authUser);
        resolve({
            status: "success",
            message: "",
            result: [{
                channelId: 1,
                shiftGroupId: 2,
                name: "abcd"
            }]
        });
    });
}