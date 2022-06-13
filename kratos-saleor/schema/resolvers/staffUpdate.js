const pgKratosQueries = require("../../postgres/kratos-queries");
const { isEmailValid } = require("../../libs/util");
const { getGraphQLUserById } = require("./lib");
const userPermissionGroupHasAccess = require("./lib/userPermissionGroupHasAccess");

module.exports = (parent, args, context) => {
    return new Promise(async resolve => {
        if (!context.user) return resolve(getGraphQLOutput("authorization-bearer", "Please enter a valid authorization header", "JWT_INVALID_TOKEN", null, null));
        const authUser = context.user;

        if (authUser.userPermissions.find(permission => permission.code == "MANAGE_STAFF")) {
            resolve(await staffUpdate(args));
        } else if (userPermissionGroupHasAccess(authUser.permissionGroups, ["MANAGE_STAFF"])) {
            resolve(await staffUpdate(args));
        } else {
            resolve(getGraphQLOutput("permission", "You do not have permission to perform this operation. MANAGE_STAFF", "OUT_OF_SCOPE_PERMISSION", null, null, null));
        }
    });
}

function staffUpdate(args) {
    return new Promise(resolve => {
        let userId = args.id;
        let input = args.input;

        let groupsToAdd = args.input.addGroups;
        let groupsToRemove = args.input.removeGroups;

        if (args.input.email)
            if (!isEmailValid(args.input.email)) return resolve(getGraphQLOutput("email", "Email format not supported", "INVALID_CREDENTIALS", null, null));

        let inputValue = [userId];
        let { values, whereClause } = getValuesForStaffUpdateFromInput(inputValue, input);

        pgKratosQueries.updateAccountUserById(values, whereClause, async result => {
            if (result.err) { console.log(result.err); return resolve(getGraphQLOutput("graphql error", "Failed to update staff", "GRAPHQL_ERROR", null, null)); }
            let res = await updateStaffGroup(userId, groupsToAdd, groupsToRemove);
            return resolve(res);
        });
    });
}

function getGraphQLOutput(field, message, code, addressType, user) {
    return {
        user: user,
        errors: [{
            field,
            message,
            code,
            addressType
        }],
        staffErrors: [{
            field,
            message,
            code,
            addressType
        }]
    };
}

function getValuesForStaffUpdateFromInput(values, input) {
    let whereClause = "";

    if (input.firstName) {
        values.push(input.firstName);
        if (whereClause) whereClause += ", ";
        whereClause += `first_name=$${values.length}`;
    }
    if (input.lastName) {
        values.push(input.lastName);
        if (whereClause) whereClause += ", ";
        whereClause += `last_name=$${values.length}`;
    }
    if (input.email) {
        values.push(input.email);
        if (whereClause) whereClause += ", ";
        whereClause += `email=$${values.length}`;
    }
    if (input.isActive) {
        values.push(input.isActive);
        if (whereClause) whereClause += ", ";
        whereClause += `is_active=$${values.length}`;
    }
    if (input.note) {
        values.push(input.note);
        if (whereClause) whereClause += ", ";
        whereClause += `note=$${values.length}`;
    }

    return { values, whereClause };
}


function updateStaffGroup(staffId, groupsToAdd, groupsToRemove) {
    return new Promise(async(resolve) => {
        try {
            let payload = {
                staffId,
                groupsToAdd,
                groupsToRemove
            };

            let res = await fetch(process.env.PERMISSIONS_APP_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: ``,
                    variables: payload
                })
            });

            let json = res.json();

            console.log(json);
        } catch (err) {
            console.log(err);
        }

        let graphQLUser = await getGraphQLUserById(staffId);
        resolve(getGraphQLOutput("", "", "INVALID", null, graphQLUser));
    });
}