const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const pgKratosQueries = require("../../postgres/kratos-queries");
const { getGraphQLUserById } = require("./lib");

module.exports = async(parent, args, context) => {
    return new Promise((resolve) => {
        if (!context.user) return resolve(getError("authorization-bearer", "Please enter a valid authorization header", "JWT_INVALID_TOKEN", null));
        const authUser = context.user;

        let newPassword = args.newPassword;
        let oldPassword = args.oldPassword;

        pgKratosQueries.getUserById([authUser.id], result => {
            if (result.err) return resolve(getError("token", "User not found", "NOT_FOUND", null));
            let accountUser = result.res[0];
            if (!bcrypt.compareSync(oldPassword, accountUser.password)) return resolve(getError("password", "Password mismatch", "INVALID_PASSWORD"));

            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(newPassword, salt);
            let values = [
                authUser.id,
                hash
            ];
            pgKratosQueries.updateAccountUserPassword(values, async result => {
                if (result.err) return resolve(getError("failed to update user", result.err, "GRAPHQL_ERROR", user));

                let graphQLUser = await getGraphQLUserById(accountUser.id);
                resolve(getResult(graphQLUser));
            });
        });
    });
}

function getError(field, message, code, addressType) {
    return {
        user: null,
        errors: [{
            field,
            message,
            code,
            addressType
        }],
        accountErrors: [{
            field,
            message,
            code,
            addressType
        }]
    };
}

function getResult(user) {
    return {
        user,
        errors: [{
            field: "",
            message: "",
            code: "",
            addressType: null
        }],
        accountErrors: [{
            field: "",
            message: "",
            code: "",
            addressType: null
        }]
    };
}