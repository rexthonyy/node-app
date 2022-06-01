// Create new permission group. Requires one of the following permissions: MANAGE_STAFF.
const { hasPermission } = require('./lib');

module.exports = async(parent, args, context) => {
    let permissions = args.addPermissions;
    let users = args.addUsers;
    let groupName = args.name;

    console.log(permissions);
    console.log(users);
    console.log(groupName);

    if (hasPermission(context.variables, ["PERMISSION_MANAGE_STAFF"])) {

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
    } else {
        return {
            errors: [{
                field: null,
                message: "Permission not found. Requires PERMISSION_MANAGE_STAFF",
                code: "OUT_OF_SCOPE_PERMISSION",
                users
            }],
            group: undefined
        }
    }
}