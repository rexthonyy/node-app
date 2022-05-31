// Create new permission group. Requires one of the following permissions: MANAGE_STAFF.
const { hasPermission } = require('./lib');

module.exports = async(parent, args, context) => {
    if (hasPermission(context.variables, ["PERMISSION_MANAGE_STAFF"])) {
        let permissions = args.addPermissions;
        let users = args.addUsers;
        let groupName = args.name;

        console.log(permissions);
        console.log(users);
        console.log(groupName);

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
}