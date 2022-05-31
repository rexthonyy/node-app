// Permission: PERMISSION_MANAGE_STAFF
// Look up permission group by ID. Requires one of the following permissions: MANAGE_STAFF.
module.exports = async(parent, args, context) => {
    console.log(context);
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