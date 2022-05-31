module.exports = async(parent, args, context) => {
    return {
        id: args.id,
        name: "sample group",
        users: null,
        permissions: [{
            code: "MANAGE_USERS",
            name: "manage users"
        }],
        userCanManage: true
    };
}