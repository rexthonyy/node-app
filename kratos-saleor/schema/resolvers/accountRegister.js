const bcrypt = require("bcryptjs");
const { authenticator } = require('otplib');
const pgKratosQueries = require("../../postgres/kratos-queries");
const { isEmailValid } = require("../../libs/util");
const { getGraphQLUserById } = require("./lib");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let firstName = args.input.firstName;
        let lastName = args.input.lastName;
        let languageCode = args.input.languageCode;
        let redirectUrl = args.input.redirectUrl;
        let metadata = args.input.metadata;
        let email = args.input.email.toLowerCase();
        let password = args.input.password;
        let channel = args.input.channel;

        if (!isEmailValid(email)) return resolve(getError("email", "Email format not supported", "INVALID_CREDENTIALS", null));

        try {
            await getUserByEmail(email);
            if (redirectUrl == null) {
                let result = await registerUser({ firstName, lastName, languageCode, metadata, email, password });
                console.log(result);
                return resolve(result);
            } else {

            }
        } catch (err) {
            return resolve(err);
        }
    });
}


function getError(field, message, code, addressType, user) {
    return {
        requiresConfirmation: false,
        errors: [{
            field,
            message,
            code,
            addressType
        }],
        user
    };
}

function getResult(requiresConfirmation, user) {
    return {
        requiresConfirmation,
        errors: [{
            field: "",
            message: "",
            code: "",
            addressType: ""
        }],
        accountErrors: [{
            field: "",
            message: "",
            code: "",
            addressType: ""
        }],
        user
    };
}

async function getUserByEmail(email) {
    return new Promise((resolve, reject) => {
        pgKratosQueries.getUserByEmail([email], result => {
            if (result.err) return reject(getError("email", "Failed to connect to DB", "INACTIVE", null));
            if (result.res.length != 0) return reject(getError("email", "Failed to connect to DB", "DUPLICATED_INPUT_ITEM", null));
            resolve();
        });
    });
}

async function registerUser(user) {
    return new Promise((resolve, reject) => {
        let userValues = getUserValues(user);
        pgKratosQueries.createAccountUser(userValues, result => {
            if (result.err) return reject(getError("Account user", "Failed to create account user", "GRAPHQL_ERROR", user));
            let accountUser = result.res[0];
            let userAddressValues = getUserAddressValues(user);
            pgKratosQueries.createAccountAddress(userAddressValues, result => {
                let accountUserAddress = result.res[0];
                let accountUserAddressValues = [accountUser.id, accountUserAddress.id];
                pgKratosQueries.createAccountUserAddress(accountUserAddressValues, async result => {
                    let graphQLUser = await getGraphQLUserById(accountUser.id);
                    resolve(getResult(false, graphQLUser));
                });
            });
        });
    });
}

function getUserValues(user) {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(user.password, salt);
    let now = new Date().toUTCString();
    let jwt_token_key = authenticator.generateSecret();

    return [
        false,
        user.email,
        false,
        true,
        hash,
        now,
        null,
        null,
        null,
        null,
        user.firstName,
        user.lastName,
        null,
        null,
        user.metadata,
        jwt_token_key,
        user.languageCode,
        "",
        now
    ];
}

function getUserAddressValues(user) {
    return [
        user.firstName,
        user.lastName,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
    ];
}