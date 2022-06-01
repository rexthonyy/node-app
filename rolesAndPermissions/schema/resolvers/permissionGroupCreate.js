// Create new permission group. Requires one of the following permissions: MANAGE_STAFF.
const { hasPermission } = require('./lib');

module.exports = async(parent, args, context) => {
    let permissions = args.input.addPermissions;
    let usrs = args.input.addUsers;
    let groupName = args.input.name;

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
        let response = {
            errors: [{
                field: null,
                message: "Permission not found. Requires PERMISSION_MANAGE_STAFF",
                code: "OUT_OF_SCOPE_PERMISSION",
                permissions: ["MANAGE_STAFF"],
                users: usrs
            }],
            group: undefined
        };
        console.log(response);
        return response;
    }
}