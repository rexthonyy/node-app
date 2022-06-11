const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const fetch = require("node-fetch");
const { authenticator } = require('otplib');
const pgKratosQueries = require("../../postgres/kratos-queries");
const { isEmailValid } = require("../../libs/util");
const { getGraphQLUserById } = require("./lib");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve) => {
        if (!context.user) return resolve(getGraphQLOutput("authorization-bearer", "Please enter a valid authorization header", "JWT_INVALID_TOKEN", null, null));
        const authUser = context.user;

        let firstName = args.input.firstName || "";
        let lastName = args.input.lastName || "";
        let languageCode = args.input.languageCode || "";
        let redirectUrl = args.input.redirectUrl;
        let email = args.input.email.toLowerCase();
        let password = util.getRandom(100000, 999999);
        let isActive = false;
        let note = args.input.note;

        if (!isEmailValid(email)) return resolve(getGraphQLOutput("email", "Email format not supported", "INVALID_CREDENTIALS", null, null));

        try {
            await getUserByEmail(email);
            isActive = redirectUrl == null;
            let result = await registerUser(authUser, { firstName, lastName, languageCode, email, password, isActive, note });
            if (!active) {
                await sendEmailConfirmation(redirectUrl, result);
            }
            return resolve(result);
        } catch (err) {
            return resolve(err);
        }
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
        accountErrors: [{
            field,
            message,
            code,
            addressType
        }]
    };
}


async function getUserByEmail(email) {
    return new Promise((resolve, reject) => {
        pgKratosQueries.getUserByEmail([email], result => {
            if (result.err) return reject(getGraphQLOutput("email", "Failed to connect to DB", "INACTIVE", null, null));
            if (result.res.length != 0) return reject(getGraphQLOutput("email", "Email is already registered", "DUPLICATED_INPUT_ITEM", null, null));
            resolve();
        });
    });
}


async function registerUser(authUser, customer) {
    return new Promise((resolve, reject) => {
        let userValues = getUserValues(customer);
        pgKratosQueries.createAccountUser(userValues, async result => {
            if (result.err) return reject(getGraphQLOutput("Account user", "Failed to create account user", "GRAPHQL_ERROR", null, null));
            let accountUser = result.res[0];
            let graphQLUser = await getGraphQLUserById(accountUser.id);
            resolve(getGraphQLOutput("", "", "INVALID", null, graphQLUser));
        });
    });
}

function getUserValues(user) {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(user.password, salt);
    let now = new Date().toUTCString();
    let jwt_token_key = authenticator.generateSecret().substring(0, 12);

    return [
        false,
        user.email,
        false,
        user.isActive,
        hash,
        now,
        null,
        null,
        null,
        user.note,
        user.firstName,
        user.lastName,
        null,
        getJSONB({}),
        getJSONB({}),
        jwt_token_key,
        user.languageCode,
        "",
        now
    ];
}

function getJSONB(json) {
    return JSON.stringify(json);
}


async function sendEmailConfirmation(redirectUrl, result) {
    return new Promise((resolve, reject) => {
        let user_id = result.user.id;
        let email = result.user.email;
        pgKratosQueries.getUserById([user_id], async result => {
            if (result.err) return reject(getError("Account user", "User not found", "GRAPHQL_ERROR", result.user));
            let accountUser = result.res[0];
            let jwtTokenKey = accountUser.jwt_token_key;
            let requestType = "email-confirmation";
            let user = {
                user_id,
                email
            };
            let userToken = jwt.sign(user, jwtTokenKey);
            let confirmationData = {
                data: userToken
            };

            let token = jwt.sign(confirmationData, process.env.AUTHORIZATION_TOKEN_SECRET, { subject: user_id + "", expiresIn: process.env.JWT_TTL_CONFIRM_EMAIL });
            console.log(token);
            let payload = {
                requestType,
                redirectUrl,
                email,
                token
            };

            try {
                let res = await fetch(process.env.LISTMONK_URL, {
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

            resolve();
        });
    });
}